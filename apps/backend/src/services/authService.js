import pool from '../config/mysql.js';
import argon2 from 'argon2';
import { ApiError } from '../utils/apiError.js';
import { verifyRefreshToken } from '../utils/jwt.js';

const tokenVersions = Object.create(null);

export const authService = {
  async registerUser(email, password) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) throw new ApiError(409, 'USER_EXISTS');

      const hashedPassword = await argon2.hash(password);
      await conn.query('INSERT INTO users (email, password) VALUES (?, ?);', [email, hashedPassword]);

      conn.commit();
    } catch (error) {
      if (conn) await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  async loginUser(email, password) {
    const [users] = await pool.query('SELECT id, email, role, password, is_active, token_version FROM users WHERE email = ?', [
      email,
    ]);
    const user = users[0];

    if (!user || !(await argon2.verify(user.password, password))) throw new ApiError(401, 'INVALID_CREDENTIALS');
    if (!user.is_active) throw new ApiError(403, 'ACCOUNT_DISABLED');

    tokenVersions[user.id] ??= 1;
    return { user, tokenVersion: user.tokenVersion };
  },

  async refreshSession(refreshToken) {
    if (!refreshToken) throw new ApiError(401, 'NO_REFRESH_TOKEN');
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) throw new ApiError(401, 'INVALID_REFRESH_TOKEN');

    const [users] = await pool.query('SELECT token_version FROM users WHERE id = ?', [decoded.id]);
    const user = users[0];
    if (!user || decoded.tv !== user.token_version) throw new ApiError(401, 'REFRESH_TOKEN_REVOKED');

    return decoded;
  },

  async logoutUser(userId) {
    await pool.query('UPDATE users SET token_version = token_version + 1 WHERE id = ?', [userId]);
  },
};
