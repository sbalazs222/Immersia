import { verifyAccessToken, generateAccessToken } from '../utils/jwt.js';
import { AuthService } from '../services/index.js';
import COOKIE_CONFIG from '../config/CookieConfig.js';

export default async function OptionalAuthenticateToken(req, res, next) {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (accessToken) {
    const decoded = verifyAccessToken(accessToken);
    if (decoded) {
      req.user = decoded;
      return next();
    }
  }

  if (refreshToken) {
    try {
      const decoded = await AuthService.Refresh(refreshToken);
      const newAccessToken = generateAccessToken({
        id: decoded.id,
        user: decoded.email,
        role: decoded.role,
      });
      res.cookie('accessToken', newAccessToken, {
        ...COOKIE_CONFIG,
        maxAge: 15 * 60 * 1000,
      });
      req.user = { id: decoded.id, user: decoded.email, role: decoded.role };
      return next();
    } catch {
      return next();
    }
  }
  return next();
}
