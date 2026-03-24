import pool from '../../config/mysql.js';

export default async function Logout(userId, lastSession) {
  await pool.query('UPDATE users SET token_version = token_version + 1 AND last_session = ? WHERE id = ?', [lastSession, userId]);
}
