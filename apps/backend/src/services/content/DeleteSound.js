import pool from '../../config/mysql.js'
import fse from 'fs-extra';
import path from 'path';

export default async function DeleteSound(slugs) {
  const conn = await pool.getConnection();


  const [sounds] = await conn.query('SELECT sound_file_path, sound_file_path_alt, image_file_path FROM sounds WHERE slug IN (?)', [slugs]);

  const files = sounds.flatMap(item => [item.sound_file_path, item.sound_file_path_alt || undefined, item.image_file_path]).filter(item=> item != undefined)

  await conn.query('DELETE FROM sounds WHERE slug IN (?)', [slugs]);

  for (const f of files) {
    if (f) await fse.unlink(path.join('/immersia_data', f)).catch(() => { });
  }
  
  await conn.commit();
  conn.release();
}
