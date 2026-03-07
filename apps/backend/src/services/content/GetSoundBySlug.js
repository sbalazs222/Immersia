import { ApiError } from '../../utils/apiError.js';
import pool from '../../config/mysql.js';

export default async function GetSoundBySlug(slug) {
  const [rows] = await pool.query('SELECT slug, title, duration_seconds, loopable, type FROM sounds WHERE slug LIKE ?', [slug]);
  if (rows.length === 0) throw new ApiError(404, 'SOUND_NOT_FOUND');
  return rows[0];
}
