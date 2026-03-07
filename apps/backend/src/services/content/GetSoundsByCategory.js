import { ApiError } from '../../utils/apiError.js';
import pool from '../../config/mysql.js';

export default async function GetSoundsByCategory(category, page, limit) {
  const CATEGORIES = ['oneshot', 'ambience', 'scene'];

  if (!CATEGORIES.includes(category)) throw new ApiError(400, 'INVALID_CATEGORY');

  const offset = (page - 1) * limit;

  const [countPromise, dataPromise] = [
    pool.query('SELECT COUNT(*) as total FROM sounds WHERE type = ?;', [category]),
    pool.query('SELECT title, slug FROM sounds WHERE type = ? LIMIT ? OFFSET ?;', [category, limit, offset]),
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
