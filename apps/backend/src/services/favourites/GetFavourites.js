import pool from '../../config/mysql.js';

export default async function GetFavourites(userId) {

  const [data] = await
    pool.query(
      `SELECT
        s.title, 
        s.slug
      FROM favourites f
      INNER JOIN sounds s ON sound.id = sound_id
      WHERE f.user_id = ?
      ORDER BY
        f.created_at DESC,
        s.title ASC`,
      [userId]
    );

  return data;
}
