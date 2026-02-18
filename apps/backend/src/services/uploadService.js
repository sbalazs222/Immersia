import path from 'path';
import { ApiError } from '../utils/apiError.js';
import pool from '../config/mysql.js';
import * as musicMetadata from 'music-metadata';
import sharp from 'sharp';
import fse from 'fs-extra';
import unzipper from 'unzipper';
import Piscina from 'piscina';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const workerPool = new Piscina({
  filename: path.resolve(__dirname, '../workers/uploadWorker.cjs'),
  minThreads: 1,
});

export const uploadService = {
  async uploadHandler(files, body) {
    const { Title, Type } = body;
    const incomingImageFile = files?.ImageFile?.[0];
    const incomingAudioFile = files?.SoundFile?.[0];

    if (!incomingAudioFile || !incomingImageFile) throw new ApiError(400, 'MISSING_FILES');
    if (!Title || !Type) throw new ApiError(400, 'MISSING_FIELDS');
    if (!['oneshot', 'ambience', 'scene'].includes(Type)) throw new ApiError(400, 'INVALID_TYPE');

    // Slug generation, file paths
    const slugBase = `${Type}-${Title.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')}`;
    const uniqueSlug = `${slugBase}-${Math.random().toString(36).substring(2, 6)}`;
    if (uniqueSlug.length > 100) throw new ApiError(400, 'TITLE_TOO_LONG');
    const soundExt = path.extname(incomingAudioFile.originalname).toLowerCase();
    const finalSoundPath = `/data/sounds/${uniqueSlug}${soundExt}`;
    const finalImagePath = `/data/thumb/${uniqueSlug}.webp`;

    const createdFiles = [];
    const conn = await pool.getConnection();
    try {
      // Audio metadata
      let duration = 0;
      try {
        const metadata = await musicMetadata.parseFile(incomingAudioFile.path);
        duration = Math.round(metadata.format.duration || 0);
      } catch {
        throw new ApiError(415, 'UNSUPPORTED_AUDIO_FORMAT');
      }

      // Image processing
      const imageMeta = await sharp(incomingImageFile.path).metadata();
      if (imageMeta.width > 5000 || imageMeta.height > 5000) throw new ApiError(400, 'IMAGE_TOO_LARGE');

      await sharp(incomingImageFile.path).resize(500, 500, { fit: 'cover' }).webp({ quality: 80 }).toFile(finalImagePath);
      createdFiles.push(finalImagePath);

      // Move audio file
      await fse.rename(incomingAudioFile.path, finalSoundPath);
      createdFiles.push(finalSoundPath);

      await conn.beginTransaction();
      await conn.query(
        `INSERT INTO immersia.sounds (slug, title, duration_seconds, loopable, sound_file_path, sound_file_format, image_file_path, type) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          uniqueSlug,
          Title,
          duration,
          Type !== 'oneshot' ? 1 : 0,
          `sounds/${uniqueSlug}${soundExt}`,
          soundExt,
          `thumb/${uniqueSlug}.webp`,
          Type,
        ]
      );

      await conn.commit();
      return { message: 'Upload successful.' };
    } catch (error) {
      await conn.rollback();
      for (const file of createdFiles) {
        await fse.unlink(file).catch(() => {});
      }
      throw error;
    } finally {
      conn.release();
      await fse.unlink(incomingAudioFile.path).catch(() => {});
      await fse.unlink(incomingImageFile.path).catch(() => {});
    }
  },

  async massUploadHandler(zipPath) {
    if (!zipPath) throw new ApiError(400, 'NO_ARCHIVE');
    const tempDir = `/data/incoming/batch-${Date.now()}`;

    await fse.ensureDir(tempDir);
    try {
      await fse
        .createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: tempDir }))
        .promise();

      const metadata = await fse.readJSON(path.join(tempDir, 'metadata.json'));

      const results = await Promise.all(
        metadata.map((item) => {
          const slug = `${item.Title.toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 8)}`;

          return workerPool.run({ item, tempDir, slug });
        })
      );

      const allCreatedFiles = results.flatMap((r) => r.files);
      const insertValues = results.map((r) => r.dbRow);

      try {
        await pool.query(
          `INSERT INTO immersia.sounds (slug, title, type, loopable, duration_seconds, sound_file_format, sound_file_path , image_file_path) VALUES ?`,
          [insertValues]
        );
      } catch (dbError) {
        for (const filePath of allCreatedFiles) {
          await fse.remove(filePath).catch(() => {});
          throw dbError;
        }
      }
      return { count: insertValues.length };
    } finally {
      await fse.remove(tempDir).catch(() => {});
      await fse.remove(zipPath).catch(() => {});
    }
  },
};
