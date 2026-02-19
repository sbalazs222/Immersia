/* eslint-disable prettier/prettier */
import { env } from '../config/config.js';
import pool from '../config/mysql.js';
import crypto from 'crypto';
import argon2 from 'argon2';
import { ApiError } from '../utils/apiError.js';
import transporter from '../config/transporter.js';

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const MINUTE_IN_MILLISECONDS = 60 * 1000;

export const mailService = {
  async confirmAddressSendToken(email, userId) {
    console.log('confirm email elküldve')
    const token = await getToken('confirm', userId);
    const link = `${env.FRONTEND_URL}/verify?token=${token}`;
    sendMail(email, link);
  },
  async resetPassword() { },

  async confirmAddressReceiveToken(token) {
    const tokenHash = crypto.hash('sha256', token);

    try {
      const [match] = await pool.query('SELECT user_id, expires_at FROM email_codes WHERE token_hash = ?;', [tokenHash])
      if (match.length<1) throw new ApiError(404, 'INVALID_TOKEN');
      if (new Date() > new Date(match.expires_at)) throw new ApiError(410, 'EXPIRED_TOKEN');

      await pool.query('UPDATE users SET is_verified = 1 WHERE id = ?;', [match[0].user_id]);

    }
    finally {
      await pool.query('DELETE FROM email_codes WHERE token_hash = ?;', [tokenHash]);
    }
  }
};


function sendMail(to, link) {
  transporter.sendMail({
    from: 'noreply@immersia.cc',
    to: to,
    subject: 'Email cím megerősítése',
    html: `
  <h1> Hello </h1>
  <p>Test email</p>
  <a href='${link}'> Cím megerősítése </a>
  `,
  });
}

async function getToken(action, userId) {
  const token = crypto.randomBytes(128).toString('hex');
  switch (action) {
    case 'confirm':
      pool.query('INSERT INTO email_codes (user_id, token_hash, expires_at, type) VALUES (?, ?, ?, ?);',
        [
          userId,
          crypto.hash('sha256', token),
          new Date(Date.now() + DAY_IN_MILLISECONDS),
          'confirm',
        ]);
      break;
    case 'password_reset':
      pool.query('INSERT INTO email_codes (user_id, token_hash, expires_at, type) VALUES (?, ?, ?, ?);',
        [
          userId,
          crypto.hash('sha256', token),
          new Date(Date.now() + 15 * MINUTE_IN_MILLISECONDS),
          'password_reset',
        ]);
      break;
  }
  return token;
}

async function refreshToken() {

}

