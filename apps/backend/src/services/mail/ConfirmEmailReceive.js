import crypto from 'crypto';
import pool from '../../config/mysql.js';
import { ApiError } from '../../utils/apiError.js';

export default async function ConfirmEmailReceive(token) {
  const tokenHash = crypto.hash('sha256', token);

  const [match] = await pool.query('SELECT user_id, expires_at FROM email_codes WHERE token_hash = ?;', [tokenHash]);
  if (match.length < 1) throw new ApiError(400, 'INVALID_TOKEN');
  if (new Date() > new Date(match[0].expires_at)) throw new ApiError(400, 'EXPIRED_TOKEN');

  await pool.query('UPDATE users SET is_verified = 1 WHERE id = ?;', [match[0].user_id]);
  await pool.query('DELETE FROM email_codes WHERE token_hash = ?;', [tokenHash]);
}
