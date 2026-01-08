import { verifyAccessToken } from '../utils/jwt.js';

export function authenticateToken(req, res, next) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  const decoded = verifyAccessToken(accessToken);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}
