import pool from '../../config/mysql.js';
import getBlindIndex from '../../utils/emailBlindIndex.js';
import argon2 from 'argon2';
import { ApiError } from '../../utils/apiError.js';
import { env } from '../../config/config.js';
import { MailService } from '../index.js';

export default async function Register(email, password) {
  const conn = await pool.getConnection();
  const index = getBlindIndex(email);

  const hashedPassword = await argon2.hash(password);

  try {
    await conn.beginTransaction();

    const [existing] = await conn.query('SELECT id, is_verified FROM users WHERE email_blind_index = ?', [index]);
    console.log(existing.length)
    if (existing.length > 0) {
      console.log(existing[0])
      if (existing[0].is_verified) throw new ApiError(409, 'USER_EXISTS');

      await conn.query('DELETE FROM users WHERE id = ? AND is_verified = 0;', existing[0].id);
    }

    const [insertResult] = await conn.query(
      'INSERT INTO users (email, email_blind_index, password) VALUES (AES_ENCRYPT(?, ?), ?, ?);',
      [email, env.DB_ENCRYPT_SECRET, index, hashedPassword]
    );
    const userId = insertResult.insertId;
    conn.commit();

    MailService.ConfirmEmailSend(email, userId);
  } catch (error) {
    if (conn) await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
