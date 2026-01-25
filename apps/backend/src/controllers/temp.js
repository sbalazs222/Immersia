/* eslint-disable prettier/prettier */
import fs from 'fs/promises';
import fse from 'fs-extra';
import unzipper from 'unzipper';
import path from 'path';
import * as musicMetadata from 'music-metadata';
import sharp from 'sharp';
import pool from '../config/mysql.js';



export async function HandleMassUpload(req, res, next) {
  const tempDir = `/data/incoming/${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const movedFiles = []; // Track files to delete if DB fails

  try {
    // 1. Extract ZIP (Do this BEFORE starting DB transaction)
    await fse.ensureDir(tempDir);
    await fse.createReadStream(req.file.path)
      .pipe(unzipper.Extract({ path: tempDir }))
      .promise();

    const metadata = await fse.readJSON(path.join(tempDir, 'metadata.json'));
    const insertValues = [];

    // 2. Map items to processing promises (Parallel Processing)
    // Using a simple map here; for very large sets, use a concurrency limit.
    await Promise.all(metadata.map(async (item) => {
      const { Title, Type, SoundFile, ImageFile } = item;

      // Generate Unique ID/Slug
      const uniqueId = Math.random().toString(36).substring(2, 8);
      const slug = `${Title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}-${uniqueId}`;

      const soundPath = path.join(tempDir, SoundFile);
      const imagePath = path.join(tempDir, ImageFile);
      const finalSoundName = `${Type}-${slug}${path.extname(SoundFile)}`;
      const finalImagePath = `${Type}-${slug}.webp`;

      // Process Image
      const destImage = `/data/thumb/${finalImagePath}`;
      await sharp(imagePath).resize(500, 500).webp().toFile(destImage);
      movedFiles.push(destImage);

      // Process Sound Metadata
      const mm = await musicMetadata.parseFile(soundPath);

      // Move Sound
      const destSound = `/data/sounds/${finalSoundName}`;
      await fse.move(soundPath, destSound);
      movedFiles.push(destSound);

      insertValues.push([
        slug, Title, Math.round(mm.format.duration || 0),
        Type !== 'oneshot' ? 1 : 0, `sounds/${finalSoundName}`,
        path.extname(SoundFile).slice(1), `thumb/${finalImagePath}`, Type
      ]);
    }));

    // 3. Database Work (Short & Fast)
    const conn = await pool.getConnection();
    try {
      await conn.query(
        `INSERT INTO immersia.sounds (...) VALUES ?`,
        [insertValues]
      );
    } finally {
      conn.release();
    }

    return res.status(200).json({ count: insertValues.length });

  } catch (error) {
    // 4. Emergency Cleanup: Delete files moved to /data/ if DB or processing failed
    for (const file of movedFiles) {
      await fse.remove(file).catch(() => { });
    }
    next(error);
  } finally {
    await fse.remove(tempDir).catch(() => { });
    await fse.remove(req.file.path).catch(() => { });
  }
}