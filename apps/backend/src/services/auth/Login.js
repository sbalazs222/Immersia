import { env } from '../../config/config.js';
import argon2 from 'argon2';
import { ApiError } from '../../utils/apiError.js';
import getBlindIndex from '../../utils/emailBlindIndex.js';
import pool from '../../config/mysql.js';

export default async function Login(email, password) {
  const [users] = await pool.query(
    'SELECT id, CAST(AES_DECRYPT(email, ?) AS CHAR) as email, role, password, is_active, is_verified, token_version, last_session FROM users WHERE email_blind_index = ?',
    [env.DB_ENCRYPT_SECRET, getBlindIndex(email)]
  );
  const user = users[0];

  if (!user || !(await argon2.verify(user.password, password))) throw new ApiError(401, 'INVALID_CREDENTIALS');
  if (!user.is_active) throw new ApiError(403, 'ACCOUNT_DISABLED');
  if (user.role !== 1 && !user.is_verified) throw new ApiError(403, 'ACCOUNT_NOT_VERIFIED');

  return { user, tokenVersion: user.token_version };
}
