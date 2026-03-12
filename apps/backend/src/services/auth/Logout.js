import pool from '../../config/mysql.js';

export default async function Logout(userId) {
  await pool.query('UPDATE users SET token_version = token_version + 1 WHERE id = ?', [userId]);
}
