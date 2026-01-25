/* eslint-disable prettier/prettier */
import fs from 'fs/promises';
import fse from 'fs-extra';
import unzipper from 'unzipper';
import path from 'path';
import * as musicMetadata from 'music-metadata';
import sharp from 'sharp';
import pool from '../config/mysql.js';

/**
 * Handles uploads of new audio files
 * @description
 * Takes title, type and files in request body, then processess them
 * * @param {import('express').Request} req Express Request object containing files and data
 * @param {import('express').Response} res Express Response object
 * @param {import('express').NextFunction} next Express next function for error handling.
 * * @returns {Promise<void>} Returns a 201 JSON response on success.
 * * @throws {Error} Passes any internal server error to the `next` middleware.
 */
export async function HandleUpload(req, res, next) {
  const incomingAudioFile = req.files?.SoundFile?.[0];
  const incomingImageFile = req.files?.ImageFile?.[0];

  if (!incomingAudioFile || !incomingImageFile) return res.status(400).json({ message: 'Missing files' });

  const conn = await pool.getConnection();
  const createdFiles = [];
  let audioMoved = false;

  try {
    const { Title, Type } = req.body;

    if (!['oneshot', 'ambience', 'scene'].includes(Type)) return res.status(400).json({ message: 'Invalid type.' });

    const slugBase = `${Type}-${Title.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')}`;

    const uniqueSlug = `${slugBase}-${Math.random().toString(36).substring(2, 6)}`;

    if (uniqueSlug.length > 100) return res.status(400).json({ message: 'Title too long.' });

    const soundExt = path.extname(incomingAudioFile.originalname).toLowerCase();
    if (!['.mp3', '.wav'].includes(soundExt)) return res.status(400).json({ message: 'Invalid sound file type.' });

    let durationInSeconds = 0;
    try {
      const metadata = await musicMetadata.parseFile(incomingAudioFile.path);
      durationInSeconds = Math.round(metadata.format.duration || 0);
    } catch {
      return res.status(415).json({ message: 'Unsupported media type' });
    }

    const finalSoundPath = `/data/sounds/${uniqueSlug}${soundExt}`;
    const finalImagePath = `/data/thumb/${uniqueSlug}.webp`;

    const imageMeta = await sharp(incomingImageFile.path).metadata();
    if (imageMeta.width > 5000 || imageMeta.height > 5000) {
      return res.status(400).json({ message: 'Image dimesons too large' });
    }
    await sharp(incomingImageFile.path).resize(500, 500, { fit: 'cover' }).webp({ quality: 80 }).toFile(finalImagePath);
    createdFiles.push(finalImagePath);

    await fs.rename(incomingAudioFile.path, finalSoundPath);
    createdFiles.push(finalSoundPath);
    audioMoved = true;

    await conn.beginTransaction();
    await conn.query(
      `INSERT INTO immersia.sounds (slug, title, duration_seconds, loopable, sound_file_path, sound_file_format, image_file_path, type) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        uniqueSlug,
        Title,
        durationInSeconds,
        Type !== 'oneshot' ? 1 : 0,
        `sounds/${uniqueSlug}${soundExt}`,
        soundExt,
        `thumb/${uniqueSlug}.webp`,
        Type
      ]
    );

    await conn.commit();

    return res.status(201).json({ message: 'Upload successful' });

  } catch (error) {
    await conn.rollback();

    for (const file of createdFiles) {
      await fs.unlink(file).catch(() => { });
    }
    next(error);

  } finally {
    conn.release();
    if (!audioMoved && incomingAudioFile?.path) await fs.unlink(incomingAudioFile.path).catch(() => { });
    if (incomingImageFile?.path) await fs.unlink(incomingImageFile.path).catch(() => { });
  }
}

/**
 * Handles mass upload of new audio files
 * @description
 * Takes archived directori with thumbnails, sounds and metadata and uploads all to database and filestore
 * * @param {import('express').Request} req Express Request object containing files and data
 * @param {import('express').Response} res Express Response object
 * @param {import('express').NextFunction} next Express next function for error handling.
 * * @returns {Promise<void>} Returns a 201 JSON response on success.
 * * @throws {Error} Passes any internal server error to the `next` middleware.
 */
export async function HandleMassUpload(req, res, next) {
  if (!req.file) return res.status(400).json({ message: 'No archive uploaded.' });

  const tempDir = `/data/incoming/${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const movedFiles = [];

  try {
    await fse.ensureDir(tempDir)
    await fse.createReadStream(req.file.path)
      .pipe(unzipper.Extract({ path: tempDir }))
      .promise();

    const metadata = await fse.readJSON(path.join(tempDir, 'metadata.json'));
    const insertValues = [];

    await Promise.all(metadata.map(async (item) => {
      const { Title, Type, SoundFile, ImageFile } = item;

      const uniqueId = Math.random().toString(36).substring(2, 8);
      const slug = `${Title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}-${uniqueId}`;

      const soundPath = path.join(tempDir, SoundFile);
      const imagePath = path.join(tempDir, ImageFile);

      const finalSoundName = `${Type}-${slug}-${path.extname(SoundFile)}`;
      const finalImageName = `${Type}-${slug}.webp`;

      const destImage = `/data/thumb/${finalImageName}`;
      await sharp(imagePath).resize(500, 500, { fit: 'cover' }).webp({ quality: 80 }).toFile(destImage);
      movedFiles.push(destImage);

      const mm = await musicMetadata.parseFile(soundPath);

      const destSound = `/data/sounds/${finalSoundName}`;
      await fse.move(soundPath, destSound);
      movedFiles.push(destSound);

      insertValues.push([
        slug,
        Title,
        Type,
        Type !== 'oneshot' ? 1 : 0,
        Math.round(mm.format.duration || 0),
        path.extname(SoundFile).slice(1),
        `sounds/${finalSoundName}`,
        `thumb/${finalImageName}`
      ]);
    }));

    const conn = await pool.getConnection();
    try {
      await conn.query(`INSERT INTO immersia.sounds (slug, title, type, loopable, duration_seconds, sound_file_format, sound_file_path , image_file_path) VALUES ?`,
        [insertValues]);
    } finally {
      conn.release();
    }
    return res.status(200).json({ message: 'Bulk upload successful', count: insertValues.length });


  } catch (error) {
    for (const file of movedFiles) {
      await fse.remove(file).catch(() => { })
    }
    next(error);
  } finally {
    await fse.remove(tempDir).catch(() => { });
    await fse.remove(req.file.path).catch(() => { });
  }
}
