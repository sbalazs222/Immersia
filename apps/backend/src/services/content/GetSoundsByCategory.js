import { ApiError } from '../../utils/apiError.js';
import pool from '../../config/mysql.js';

export default async function GetSoundsByCategory(category, page, limit, userId) {

  const offset = (page - 1) * limit;

  const [countPromise, dataPromise] = [
    pool.query('SELECT COUNT(*) as total FROM sounds WHERE type = ?;', [category]),
    pool.query(
      `SELECT
        s.title, 
        s.slug,
        (f.user_id IS NOT NULL) AS is_favourite
      FROM sounds s
      LEFT JOIN favourites f ON s.id = f.sound_id AND f.user_id = ?
      WHERE s.type = ? 
      ORDER BY
        f.created_at DESC,
        s.title ASC 
      LIMIT ? OFFSET ?;`,
      [userId, category, limit, offset]
    ),
  ];

  const [[countResult], [rows]] = await Promise.all([countPromise, dataPromise]);
  const total = countResult[0].total;

  return {
    rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
