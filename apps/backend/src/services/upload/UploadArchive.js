import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Piscina from 'piscina';
import { ApiError } from '../../utils/apiError.js';
import unzipper from 'unzipper';
import fse from 'fs-extra';
import pool from '../../config/mysql.js';
import pLimit from 'p-limit';
import { env } from '../../config/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const workerPool = new Piscina({
  filename: path.resolve(__dirname, '../../workers/uploadWorker.cjs'),
  minThreads: 1,
  maxThreads: env.UPLOAD_CONCURRENCY_LIMIT + 1,
});

const limit = pLimit(env.UPLOAD_CONCURRENCY_LIMIT);

export default async function UploadArchive(zipPath) {
  if (!zipPath) throw new ApiError(400, 'NO_ARCHIVE');
  const tempDir = `/immersia_data/incoming/batch-${Date.now()}`;

  await fse.ensureDir(tempDir);
  try {
    await fse
      .createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: tempDir }))
      .promise();

    const metadata = await fse.readJSON(path.join(tempDir, 'metadata.json'));
    if (!metadata) throw new ApiError(400, 'NO_METADATA');

    const uploadPromises = metadata.map((item, index) => {

      if (!item || Object.keys(item).length === 0) return null;

      const slug = `${item.Title.toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 8)}`;

      return limit(() => workerPool.run({ item, tempDir, slug, index }));
    });

    const results = (await Promise.all(uploadPromises)).filter(Boolean); // csak a nem 'null' objektumok
    const allErrors = results.filter(r => r.errors).map(r => r.errors);

    if (allErrors.length > 0) {
      const filesToCleanup = results.filter(r => r.files).flatMap(r => r.files);
      for (const filePath of filesToCleanup) {
        await fse.remove(filePath).catch(() => { });
      }

      return {
        success: false,
        errors: allErrors
      };
    }
    const insertValues = results.map((r) => {
      r.dbRow.slug,
        r.dbRow.title,
        r.dbRow.type,
        r.dbRow.sound_file_path,
        r.dbRow.sound_file_path_alt || null,
        r.dbRow.image_file_path
    });

    try {
      await pool.query(
        `INSERT INTO immersia.sounds (slug, title, type, sound_file_path, sound_file_path_alt, image_file_path) VALUES ?`,
        [insertValues]
      );
    } catch (dbError) {
      for (const filePath of allCreatedFiles) {
        await fse.remove(filePath).catch(() => { });
        throw dbError;
      }
    }
    return { count: insertValues.length };
  } finally {
    await fse.remove(tempDir).catch(() => { });
    await fse.remove(zipPath).catch(() => { });
  }
}
