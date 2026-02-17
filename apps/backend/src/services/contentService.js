import { ApiError } from '../utils/apiError.js';
import pool from '../config/mysql.js';

export const contentService = {
  async getSoundsByCategory(category, page, limit) {
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
  },
  async getSoundBySlug(slug) {
    const [rows] = await pool.query('SELECT * FROM sounds WHERE slug LIKE ?', [slug]);
    if (rows.length === 0) throw new ApiError(404, 'SOUND_NOT_FOUND');
    return rows[0];
  },
};
