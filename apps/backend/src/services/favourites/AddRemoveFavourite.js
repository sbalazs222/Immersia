import { ApiError } from '../../utils/apiError.js';
import pool from '../../config/mysql.js';

export default async function AddRemoveFavourite(userId, slug) {
  const [isFav] = await pool.query(
    'SELECT * FROM favourites WHERE user_id = ? AND s.slug = ? INNER JOIN sounds ON sound_id = sounds.id;',
    [userId, slug]
  );
  if (isFav.length < 1) {
    await pool.query('INSERT INTO favourites (user_id, sound_id) VALUES (?, (SELECT id FROM sounds WHERE slug = ?;));', [
      userId,
      slug,
    ]);
  } else {
    await pool.query('DELETE FROM favourites WHERE user_id = ? AND sound_id = (SELECT id FROM sounds WHERE slug = ?;));', [
      userId,
      slug,
    ]);
  }
}
