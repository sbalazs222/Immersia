import pool from '../../config/mysql.js';

export default async function Logout(userId, lastSession) {
  let serializedSession = null;

  if (lastSession != null) {
    if (typeof lastSession === 'string') {
      try {
        JSON.parse(lastSession);
        serializedSession = lastSession;
      } catch {
        serializedSession = null;
      }
    } else {
      try {
        serializedSession = JSON.stringify(lastSession);
      } catch {
        serializedSession = null;
      }
    }
  }

  await pool.query('UPDATE users SET token_version = token_version + 1, last_session = ? WHERE id = ?', [serializedSession, userId]);
}
