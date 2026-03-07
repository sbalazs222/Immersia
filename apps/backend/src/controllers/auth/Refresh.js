import { AuthService } from '../../services/index.js';
import { generateAccessToken } from '../../utils/jwt.js';
import COOKIE_CONFIG from '../../config/CookieConfig.js';

export default async function Refresh(req, res, next) {
  try {
    const decoded = await AuthService.Refresh(req.cookies.refreshToken);

    const accessToken = generateAccessToken({
      id: decoded.id,
      user: decoded.email,
      role: decoded.role,
    });

    res.cookie('accessToken', accessToken, {
      ...COOKIE_CONFIG,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(200).json({ message: 'SUCCESS' });
  } catch (error) {
    next(error);
  }
}
