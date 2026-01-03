import pool from '../config/mysql.js';
import argon2 from 'argon2';
import { env } from '../config/config.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';

export async function Login(req, res, next) {
  const conn = await pool.getConnection();
  const { email, password } = req.body;
  try {
    const [user] = await conn.query('SELECT id, password FROM users WHERE email = ?', [email]);
    if (user.length < 1) return res.status(400).json({ message: 'Invalid username or password' });

    if (!(await argon2.verify(user[0].password, password)))
      return res.status(400).json({ message: 'Invalid username or password' });

    const payload = {
      id: user[0].id,
      user: user[0].email,
      role: user[0].role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ message: 'Successful login.' });
  } catch (error) {
    next(error);
  } finally {
    conn.release();
  }
}
export function Register(req, res, next) {
  try {
    const body = req.body;

    return res.status(200).json({
      message: 'Successful registration.',
      data: JSON.stringify(body),
    });
  } catch (error) {
    next(error);
  }
}
export function Verify(req, res, next) {}
export function Refresh(req, res, next) {}
export function Logout(req, res, next) {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(200).json({ message: 'Successful logout' });
  } catch (error) {
    next(error);
  }
}
