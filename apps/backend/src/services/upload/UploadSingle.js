import { ApiError } from '../../utils/apiError.js';
import path from 'path';
import pool from '../../config/mysql.js';
import sharp from 'sharp';
import fse from 'fs-extra';

export default async function UploadSingle(files, body) {
  const { Title, Type } = body;
  const incomingImageFile = files?.ImageFile?.[0];

  if (!incomingImageFile) throw new ApiError(400, 'MISSING_FILES');
  if (!Title || !Type) throw new ApiError(400, 'MISSING_FIELDS');
  if (!['oneshot', 'ambience', 'scene'].includes(Type)) throw new ApiError(400, 'INVALID_TYPE');

  const audioConfigs = Type === 'scene'
    ? [{ file: files?.SoundFileExplore?.[0], prefix: 'explore' }, { file: files?.SoundFileCombat?.[0], prefix: 'combat' }]
    : [{ file: files?.SoundFile?.[0], prefix: '' }];

  if (audioConfigs.some(cfg => !cfg.file)) throw new ApiError(400, 'MISSING_AUDIO_FILES');

  const slugBase = `${Type}-${Title.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')}`;
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const uniqueSlug = `${slugBase}-${randomSuffix}`;
  if (uniqueSlug.length > 100) throw new ApiError(400, 'TITLE_TOO_LONG');

  const finalImagePath = `/immersia_data/thumb/${uniqueSlug}.webp`;


  const createdFiles = [];
  const audioPaths = [];

  const conn = await pool.getConnection();
  try {

    const imageMeta = await sharp(incomingImageFile.path).metadata();
    if (imageMeta.width > 5000 || imageMeta.height > 5000) throw new ApiError(400, 'IMAGE_TOO_LARGE');

    await sharp(incomingImageFile.path).resize(500, 500, { fit: 'cover' }).webp({ quality: 80 }).toFile(finalImagePath);
    createdFiles.push(finalImagePath);

    for (const cfg of audioConfigs) {
      const statePrefix = cfg.prefix ? `${cfg.prefix}-` : '';
      const fileSlug = `${Type}-${statePrefix}${Title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}`;

      const uniqueFileSlug = `${fileSlug}-${randomSuffix}`;

      const ext = path.extname(cfg.file.originalname).toLocaleLowerCase();

      const fileName = `${uniqueFileSlug}${ext}`;
      const fullPath = `/immersia_data/sounds/${fileName}`;

      await fse.move(cfg.file.path, fullPath);
      createdFiles.push(fullPath)
      audioPaths.push(`sounds/${fileName}`);
    }

    await conn.beginTransaction();
    await conn.query(
      `INSERT INTO immersia.sounds (slug, title, sound_file_path, sound_file_path_alt, image_file_path, type) VALUES ( ?, ?, ?, ?, ?, ? );`,
      [uniqueSlug, Title, audioPaths[0], audioPaths[1] || null, `thumb/${uniqueSlug}.webp`, Type]
    );

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    for (const file of createdFiles) {
      await fse.unlink(file).catch(() => { });
    }
    throw error;
  } finally {
    conn.release();
    const allIncoming = [incomingImageFile, ...audioConfigs.map(c => c.file)];
    for (const f of allIncoming) {
      if (f?.path) await fse.unlink(f.path).catch(() => { });
    }
  }
}
