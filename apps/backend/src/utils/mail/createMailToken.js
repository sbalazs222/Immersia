import crypto from 'crypto';
import pool from '../../config/mysql.js';

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const MINUTE_IN_MILLISECONDS = 60 * 1000;

/**
 * @typedef {('confirm' | 'password_reset')} mailTokenType
 * @param {mailTokenType} action
 * @param {Number} userId
 */
export default async function createMailToken(action, userId) {
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
