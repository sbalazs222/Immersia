import pool from '../../config/mysql.js';

export default async function AddRemoveFavourite(userId, slug) {
  const [isFav] = await pool.query(
    'SELECT * FROM favourites f INNER JOIN sounds s ON f.sound_id = s.id WHERE f.user_id = ? AND s.slug = ?;',
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
