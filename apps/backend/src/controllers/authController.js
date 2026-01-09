import pool from '../config/mysql.js';
import argon2 from 'argon2';
import { env } from '../config/config.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const tokenVersions = Object.create(null);

export async function Login(req, res, next) {
  const conn = await pool.getConnection();
  const { email, password } = req.body;

  try {
    const [user] = await conn.query('SELECT id, password, is_active FROM users WHERE email = ?', [email]);
    if (user.length < 1) return res.status(400).json({ message: 'Invalid username or password' });
    if (!user[0].is_active) return res.status(400).json({ message: 'Account is disabled' });

    if (!(await argon2.verify(user[0].password, password)))
      return res.status(400).json({ message: 'Invalid username or password' });

    tokenVersions[user[0].id] ??= 1;

    const accessToken = generateAccessToken({
      id: user[0].id,
      user: user[0].email,
      role: user[0].role,
    });
    const refreshToken = generateRefreshToken({
      id: user[0].id,
      user: user[0].email,
      role: user[0].role,
      tv: tokenVersions[user[0].id],
    });

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
export function Verify(_, res) {
  return res.status(200).json({ message: 'Successful verification.' });
}
export function Refresh(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh Token required.' });

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) return res.status(401).json({ message: 'Invalid refresh token.' });
    const currentVersion = tokenVersions[decoded.id] ?? 1;

    if (decoded.tv !== currentVersion) {
      return res.status(401).json({ message: 'Refresh token revoked.' });
    }

    const accessToken = generateAccessToken({
      id: decoded.id,
      user: decoded.email,
      role: decoded.role,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(200).json({ message: 'Successful refresh' });
  } catch (error) {
    next(error);
  }
}
export function Logout(req, res, next) {
  try {
    tokenVersions[req.user.id] = (tokenVersions[req.user.id] ?? 1) + 1;
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    console.log(tokenVersions);

    return res.status(200).json({ message: 'Successful logout' });
  } catch (error) {
    next(error);
  }
}
