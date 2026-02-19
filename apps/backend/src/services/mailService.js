import { env } from '../config/config.js';
import pool from '../config/mysql.js';
import crypto from 'crypto';
import { ApiError } from '../utils/apiError.js';
import transporter from '../config/transporter.js';

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const MINUTE_IN_MILLISECONDS = 60 * 1000;

export const mailService = {
  async confirmAddressSendToken(email, userId) {
    const token = await getToken('confirm', userId);
    const link = `${env.FRONTEND_URL}/verify?token=${token}`;
    sendMail(email, link);
  },
  async resetPassword() {},

  async confirmAddressReceiveToken(token) {
    const tokenHash = crypto.hash('sha256', token);

    const [match] = await pool.query('SELECT user_id, expires_at FROM email_codes WHERE token_hash = ?;', [tokenHash]);
    if (match.length < 1) throw new ApiError(404, 'INVALID_TOKEN');
    if (new Date() > new Date(match[0].expires_at)) throw new ApiError(410, 'EXPIRED_TOKEN');

    await pool.query('UPDATE users SET is_verified = 1 WHERE id = ?;', [match[0].user_id]);
    await pool.query('DELETE FROM email_codes WHERE token_hash = ?;', [tokenHash]);
  },
  async resendConfirmAddressToken(token) {
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

    const newToken = await getToken('confirm', exists[0].user_id);
    const link = `${env.FRONTEND_URL}/verify?token=${newToken}`;
    sendMail(email[0].email, link);
    await pool.query('DELETE FROM email_codes WHERE token_hash = ?;', [tokenHashOld]);
  },
};

async function getToken(action, userId) {
  const token = crypto.randomBytes(128).toString('hex');
  switch (action) {
    case 'confirm':
      pool.query('INSERT INTO email_codes (user_id, token_hash, expires_at, type) VALUES (?, ?, ?, ?);', [
        userId,
        crypto.hash('sha256', token),
        new Date(Date.now() + DAY_IN_MILLISECONDS),
        'confirm',
      ]);
      break;
    case 'password_reset':
      pool.query('INSERT INTO email_codes (user_id, token_hash, expires_at, type) VALUES (?, ?, ?, ?);', [
        userId,
        crypto.hash('sha256', token),
        new Date(Date.now() + 15 * MINUTE_IN_MILLISECONDS),
        'password_reset',
      ]);
      break;
  }
  return token;
}

function sendMail(to, link) {
  transporter.sendMail({
    from: 'noreply@immersia.cc',
    to: to,
    subject: 'Email cím megerősítése',
    html: `
  <h1> Immersia </h1>
  <p>A következő linkre kattintva megerősítheti email címét.</p>
  <p>Ha nem ön kezdeményezte a regisztrációt nyugodtan figyelmen kívűl hagyhatja ez a levelet.</p>
  <a href='${link}'> Cím megerősítése </a>
  `,
  });
}
