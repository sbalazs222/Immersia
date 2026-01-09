const CATEGORIES = ['oneshot', 'ambience', 'scene'];
import pool from '../config/mysql.js';

export async function ServeData(req, res, next) {
  const conn = await pool.getConnection();

  try {
    const category = req.query.c;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM sounds WHERE type = ?;', [category]);
    const total = countResult[0].total;

    if (!CATEGORIES.includes(category)) return res.status(404).json({ message: 'Invalid or missing category' });

    const [result] = await conn.query('SELECT title, slug FROM sounds WHERE type = ? LIMIT ? OFFSET ?;', [
      category,
      limit,
      offset,
    ]);

    return res.status(200).json({
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
}

export async function GetSoundData(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const slug = req.params.slug;

    const [result] = await conn.query('SELECT * FROM sounds WHERE slug = ?', [slug]);

    return res.status(200).json(result[0]);
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
}

export async function PlaySound(req, res) {
  const slug = req.params.slug;

  const [file] = await pool.query('SELECT sound_file_path FROM sounds WHERE slug = ?', [slug]);

  res.set('X-Accel-Redirect', '/internal/' + file[0].sound_file_path);
  res.set('Content-Type', 'audio/mpeg');
  res.end();
}

export async function GetThumbnail(req, res) {
  const slug = req.params.slug;

  const [file] = await pool.query('SELECT image_file_path FROM sounds WHERE slug = ?', [slug]);

  res.set('X-Accel-Redirect', '/internal/' + file[0].image_file_path);
  res.set('Content-Type', 'image/jpeg');
  res.end();
}
