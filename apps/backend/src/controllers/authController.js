import pool from '../config/mysql.js';
import argon2 from 'argon2';
import { env } from '../config/config.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { validateEmail } from '../utils/validation/validateEmail.js';
import { validatePassword } from '../utils/validation/validatePassword.js';

const tokenVersions = Object.create(null); // Used for invalidation old tokens after logout

/**
 * Handles user authentication and session creation.
 * * @description
 * This function performs the following security checks:
 * 1. Verifies if the account exists via email.
 * 2. Checks if the account is currently active (`is_active`).
 * 3. Validates the provided password using Argon2.
 * * On success, it initializes the token version and sets two HTTP-only cookies:
 * - `accessToken`: Short-lived (15 min) for authorization.
 * - `refreshToken`: Long-lived (7 days) for session persistence.
 *
 * * @param {import('express').Request} req - Express request object containing `email` and `password` in `req.body`.
 * @param {import('express').Response} res - Express response object used to set cookies and return status.
 * @param {import('express').NextFunction} next - Express next function for error handling.
 * * @returns {Promise<void>} Returns a 200 JSON response on success, or 401/403 on authentication failure.
 * * @throws {Error} Passes any database or internal server errors to the `next` middleware.
 */
export async function Login(req, res, next) {
  const conn = await pool.getConnection();
  const { email, password } = req.body;

  try {
    const [user] = await conn.query('SELECT id, password, is_active FROM users WHERE email = ?', [email]);
    if (user.length < 1) return res.status(401).json({ message: 'Invalid address or password' });
    if (!user[0].is_active) return res.status(403).json({ message: 'Account is disabled' });

    if (!(await argon2.verify(user[0].password, password)))
      return res.status(401).json({ message: 'Invalid address or password' });

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
/**
 * Handles new user registration with transaction safety.
 * * @description
 * This function performs the following steps:
 * 1. Validates the email format.
 * 2. Checks if the email is already registered in the database.
 * 3. Validates password strength/format.
 * 4. Hashes the password using Argon2.
 * 5. Executes an atomic INSERT within a SQL transaction.
 * *  @param {import('express').Request} req - Express request object containing `email` and `password`.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function for error handling.
 * * @returns {Promise<import('express').Response|void>} Returns a 201 status on success,
 * or 400 if validation/duplicate checks fail.
 * * @throws {Error} Rolls back the transaction and passes database errors to the error middleware.
 */
export async function Register(req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const { email, password } = req.body;

    if (!validateEmail(email)) return res.status(400).json({ message: 'Incorrect email format.' });

    const [user] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);
    if (user.length > 0) return res.status(400).json({ message: 'Account with address already exists. ' });

    if (!validatePassword(password)) return res.status(400).json({ message: 'Incorrect password.' });

    await conn.query('INSERT INTO users (email, password) VALUES (?, ?);', [email, await argon2.hash(password)]);

    conn.commit();
    return res.status(201).json({ message: 'Successful registration.' });
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    if (conn) conn.release();
  }
}
/**
 * Confirms the validity of the user's current access token.
 * @description
 * If the request reaches this function, the token is valid.
 * @returns {import('express').Response} 200 JSON indicating the user is verified.
 */
export function Verify(_, res) {
  return res.status(200).json({ message: 'Successful verification.' });
}
/**
 * Issues a new access token using a valid refresh token.
 * @description
 * 1. Extracts the `refreshToken` from HTTP-only cookies.
 * 2. Verifies the token's signature and expiration.
 * 3. Checks the `tv` (Token Version) against the server-side versioning to handle revocations.
 * 4. Issues a new short-lived `accessToken` cookie.
 * * @param {import('express').Request} req - Express request containing cookies.
 * @param {import('express').Response} res - Express response to set the new cookie.
 * @param {import('express').NextFunction} next - Error handling middleware.
 * @returns {Promise<import('express').Response|void>} 200 on success, or 401 if the token is missing, invalid, or revoked.
 */
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
/**
 * Terminates the user session and invalidates all active refresh tokens.
 * @description
 * 1. Increments the user's `tokenVersions` value, effectively revoking all existing refresh tokens.
 * 2. Clears both `accessToken` and `refreshToken` cookies from the client.
 * * @param {import('express').Request} req - Express request (requires `req.user` from auth middleware).
 * @param {import('express').Response} res - Express response to clear cookies.
 * @param {import('express').NextFunction} next - Error handling middleware.
 * @returns {import('express').Response|void} 200 JSON confirming logout.
 */
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
