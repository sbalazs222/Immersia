import crypto from 'crypto';
import pool from '../../config/mysql.js';
import { ApiError } from '../../utils/apiError.js';
import createMailToken from '../../utils/mail/createMailToken.js';
import sendConfirmMail from '../../utils/mail/sendConfirmMail.js';
import { env } from '../../config/config.js';

export default async function ConfirmEmailResend(token) {
  const tokenHashOld = crypto.hash('sha256', token);
  const [exists] = await pool.query(
    'SELECT * FROM email_codes WHERE token_hash = ? AND expires_at < NOW() AND type = "confirm";',
    [tokenHashOld]
  );

  if (exists.length < 1) throw new ApiError(404, 'INVALID_TOKEN');

  const [email] = await pool.query('SELECT AES_DECRYPT(email, ?) as email FROM users WHERE id = ?', [
    env.DB_ENCRYPT_SECRET,
    exists[0].user_id,
  ]);

  if (exists.length < 1) throw new ApiError(400, 'INVALID_CONFIRM_TOKEN');

  const newToken = await createMailToken('confirm', exists[0].user_id);
  const link = `${env.FRONTEND_URL}/verify?token=${newToken}`;
  sendConfirmMail(email[0].email, link);
  await pool.query('DELETE FROM email_codes WHERE token_hash = ?;', [tokenHashOld]);
}
