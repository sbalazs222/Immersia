import fs from 'fs/promises';
import path from 'path';
import * as musicMetadata from 'music-metadata';
import sharp from 'sharp';
import pool from '../config/mysql.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function HandleUpload(req, res, next) {
  try {
    const { Title, Type } = req.body;
    const incomingAudioFile = req.files.SoundFile[0];
    const incomingImageFile = req.files.ImageFile[0];

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
      title: Title,
      type: Type,
      audioFileType: path.extname(incomingAudioFile.originalname).slice(1),
      audioFilePath: `sounds/${newSoundName}`,
      imageFilePath: `images/${newImageName}`,
      loopable: Type !== 'oneshot',
      duration: durationInSeconds,
    };

    return res.status(201).json({ message: 'Upload successful' });
  } catch (error) {
    if (req.files) {
      if (req.files.SoundFile) await fs.unlink(req.files.SoundFile[0].path).catch(() => {});
      if (req.files.ImageFile) await fs.unlink(req.files.ImageFile[0].path).catch(() => {});
    }
    next(error);
  }
}
