import { AuthService } from '../../services/index.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.js';
import COOKIE_CONFIG from '../../config/CookieConfig.js';

export default async function Login(req, res) {
  const { email, password } = req.body;

  const { user, tokenVersion } = await AuthService.Login(email, password);

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    id: user.id,
    role: user.role,
    tv: tokenVersion,
  });

  res.cookie('accessToken', accessToken, {
    ...COOKIE_CONFIG,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_CONFIG,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json({ message: 'SUCCESS', data: { role: user.role } });
}
