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
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { Title, Type } = req.body;
    const incomingAudioFile = req.files.SoundFile[0];
    const incomingImageFile = req.files.ImageFile[0];

    const slug =
      Type +
      Title.toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-');

    const uniqueSlug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;

    const metadata = await musicMetadata.parseFile(incomingAudioFile.path);
    const durationInSeconds = Math.round(metadata.format.duration || 0);

    const soundExt = path.extname(incomingAudioFile.originalname);
    const newSoundName = `${Type}-${uniqueSlug}${soundExt}`;
    const newImageName = `${Type}-${uniqueSlug}.webp`;

    const finalSoundPath = `/data/sounds/${newSoundName}`;
    const finalImagePath = `/data/thumb/${newImageName}`;

    await fs.rename(incomingAudioFile.path, finalSoundPath);

    await sharp(incomingImageFile.path).resize(500, 500, { fit: 'cover' }).webp({ quality: 80 }).toFile(finalImagePath);

    await fs.unlink(incomingImageFile.path).catch(() => { });

    const dbData = {
      slug: uniqueSlug,
      title: Title,
      type: Type,
      sound_file_format: path.extname(incomingAudioFile.originalname).slice(1),
      sound_file_path: `sounds/${newSoundName}`,
      image_file_path: `thumb/${newImageName}`,
      loopable: Type !== 'oneshot' ? 1 : 0,
      duration_seconds: durationInSeconds,
    };

    await conn.query(
      'INSERT INTO immersia.sounds (slug, title, duration_seconds, loopable, sound_file_path, sound_file_format, image_file_path, `type`) VALUES( ?, ?, ?, ?, ?, ?, ?, ?);',
      [
        dbData.slug,
        dbData.title,
        dbData.duration_seconds,
        dbData.loopable,
        dbData.sound_file_path,
        dbData.sound_file_format,
        dbData.image_file_path,
        dbData.type,
      ]
    );
    await conn.commit();
    return res.status(201).json({ message: 'Upload successful' });
  } catch (error) {
    await conn.rollback();
    if (req.files) {
      if (req.files.SoundFile) await fs.unlink(req.files.SoundFile[0].path).catch(() => { });
      if (req.files.ImageFile) await fs.unlink(req.files.ImageFile[0].path).catch(() => { });
    }
    next(error);
  } finally {
    conn.release();
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
  const conn = await pool.getConnection();
  const tempDir = `/data/incoming/${Date.now()}`;
  try {
    await conn.beginTransaction();
    const archiveFile = req.file;
    // eslint-disable-next-line prettier/prettier
    await fse.createReadStream(archiveFile.path)
      .pipe(unzipper.Extract({ path: tempDir }))
      .promise();

    const metadata = await fse.readJSON(`${tempDir}/metadata.json`);

    const Values = [];
    for (const item of metadata) {
      const { Title, Type, SoundFile, ImageFile } = item;

      const soundPath = `${tempDir}/${SoundFile}`;
      const imagePath = `${tempDir}/${ImageFile}`;

      const slug = Title.toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-');

      const uniqueSlug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;

      const metadata = await musicMetadata.parseFile(soundPath);
      const durationInSeconds = Math.round(metadata.format.duration || 0);

      const soundExt = path.extname(SoundFile);
      const newSoundName = `${Type}-${uniqueSlug}${soundExt}`;
      const newImageName = `${Type}-${uniqueSlug}.webp`;

      const finalSoundPath = `/data/sounds/${newSoundName}`;
      const finalImagePath = `/data/thumb/${newImageName}`;

      await fs.rename(soundPath, finalSoundPath);

      await sharp(imagePath).resize(500, 500, { fit: 'cover' }).webp({ quality: 80 }).toFile(finalImagePath);

      await fs.unlink(imagePath).catch(() => { });

      const dbData = {
        slug: uniqueSlug,
        title: Title,
        type: Type,
        sound_file_format: path.extname(SoundFile).slice(1),
        sound_file_path: `sounds/${newSoundName}`,
        image_file_path: `thumb/${newImageName}`,
        loopable: Type !== 'oneshot' ? 1 : 0,
        duration_seconds: durationInSeconds,
      };

      Values.push([
        dbData.slug,
        dbData.title,
        dbData.duration_seconds,
        dbData.loopable,
        dbData.sound_file_path,
        dbData.sound_file_format,
        dbData.image_file_path,
        dbData.type,
      ]);
    }
    await conn.query(
      'INSERT INTO immersia.sounds (slug, title, duration_seconds, loopable, sound_file_path, sound_file_format, image_file_path, `type`) VALUES ?;',
      [Values]
    );

    await conn.commit();
    return res.status(200).json({ message: 'Bulk upload successful' });
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    await fse.remove(tempDir);
    conn.release();
  }
}
