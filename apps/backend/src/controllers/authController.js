import { env } from '../config/config.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { authService } from '../services/index.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000, // 15 minutes
};

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
  try {
    const { email, password } = req.body;

    const { user, tokenVersion } = await authService.loginUser(email, password);

    const accessToken = generateAccessToken({
      id: user.id,
      user: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      user: user.email,
      role: user.role,
      tv: tokenVersion,
    });

    res.cookie('accessToken', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ message: 'Successful login.' });
  } catch (error) {
    next(error);
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
  try {
    const { email, password } = req.body;

    await authService.registerUser(email, password);
    return res.status(201).json({ message: 'Successful registration.' });
  } catch (error) {
    next(error);
  }
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
export async function Refresh(req, res, next) {
  try {
    const decoded = await authService.refreshSession(req.cookies.refreshToken);

    const accessToken = generateAccessToken({
      id: decoded.id,
      user: decoded.email,
      role: decoded.role,
    });

    res.cookie('accessToken', accessToken, {
      ...COOKIE_OPTIONS,
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
export async function Logout(req, res, next) {
  try {
    await authService.logoutUser(req.user.id);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(200).json({ message: 'Successful logout' });
  } catch (error) {
    next(error);
  }
}
