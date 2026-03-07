import { verifyAccessToken } from '../utils/jwt.js';

export function authenticateToken(req, res, next) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'NO_TOKEN' });
  }
  const decoded = verifyAccessToken(accessToken);

  if (!decoded) {
    return res.status(401).json({ message: 'INVALID_TOKEN' });
  }

  req.user = decoded;
  next();
}
