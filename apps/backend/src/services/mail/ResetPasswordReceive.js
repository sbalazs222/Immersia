import crypto from 'crypto';
import argon2 from 'argon2';
import pool from '../../config/mysql.js';
import { ApiError } from '../../utils/apiError.js';

export default async function ResetPasswordReceive(token, newPassword) {
  const tokenHash = crypto.hash('sha256', token);

  const [match] = await pool.query('SELECT user_id, expires_at FROM email_codes WHERE token_hash = ?;', [tokenHash]);
  if (match.length < 1) throw new ApiError(400, 'INVALID_TOKEN');
  if (new Date() > new Date(match[0].expires_at)) throw new ApiError(400, 'EXPIRED_TOKEN');

  const newPasswordHash = await argon2.hash(newPassword);
  await pool.query('UPDATE users SET password = ? WHERE id = ?;', [newPasswordHash, match[0].user_id]);
  await pool.query('DELETE FROM email_codes WHERE token_hash = ?;', [tokenHash]);
}
