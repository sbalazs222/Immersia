import pool from '../../config/mysql.js'
import fse from 'fs-extra';
import path from 'path';
import { ApiError } from '../../utils/apiError.js';

export default async function DeleteSound(slug) {
  const conn = await pool.getConnection();

  const [result] = await conn.query('SELECT * FROM sounds WHERE slug = ?', [slug]);

  if (result.length < 1) throw new ApiError(404, 'NOT_FOUND');
  const sound = result[0];

  console.log(sound);

  await conn.query('DELETE FROM sounds WHERE slug = ?', [slug]);

  const files = [sound.sound_file_path || '', sound.sound_file_path_alt || undefined, sound.image_file_path || ''];
  for (const f of files) {
    if (f) await fse.unlink(path.join('/immersia_data', f)).catch(() => { });
  }
  
  await conn.commit();
  conn.release();
}