import fs from 'fs/promises';
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

    if (!Title || !Type || !incomingAudioFile || !incomingImageFile)
      return res.status(400).json({ message: 'Invalid request, not enough objects provided.' });

    const slug = Title.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');

    const metadata = await musicMetadata.parseFile(incomingAudioFile.path);
    const durationInSeconds = Math.round(metadata.format.duration || 0);

    const soundExt = path.extname(incomingAudioFile.originalname);
    const newSoundName = `${Type}-${slug}${soundExt}`;
    const newImageName = `${Type}-${slug}.webp`;

    const finalSoundPath = `/data/sounds/${newSoundName}`;
    const finalImagePath = `/data/thumb/${newImageName}`;

    await fs.rename(incomingAudioFile.path, finalSoundPath);

    await sharp(incomingImageFile.path).resize(500, 500, { fit: 'cover' }).webp({ quality: 80 }).toFile(finalImagePath);

    await fs.unlink(incomingImageFile.path).catch(() => {});

    const dbData = {
      slug: slug,
      title: Title,
      type: Type,
      audioFileType: path.extname(incomingAudioFile.originalname).slice(1),
      audioFilePath: `sounds/${newSoundName}`,
      imageFilePath: `images/${newImageName}`,
      loopable: Type !== 'oneshot',
      duration: durationInSeconds,
    };

    await pool.query(
      'INSERT INTO immersia.sounds (slug, title, duration_seconds, loopable, sound_file_path, sound_file_format, image_file_path, `type`) VALUES( ?, ?, ?, ?, ?, ?, ?, ?);',
      [
        dbData.slug,
        dbData.title,
        dbData.durationInSeconds,
        dbData.loopable,
        dbData.audioFilePath,
        dbData.audioFileType,
        dbData.imageFilePath,
        dbData.type,
      ]
    );
    await conn.commit();
    return res.status(201).json({ message: 'Upload successful' });
  } catch (error) {
    await conn.rollback();
    if (req.files) {
      if (req.files.SoundFile) await fs.unlink(req.files.SoundFile[0].path).catch(() => {});
      if (req.files.ImageFile) await fs.unlink(req.files.ImageFile[0].path).catch(() => {});
    }
    next(error);
  } finally {
    conn.release();
  }
}
