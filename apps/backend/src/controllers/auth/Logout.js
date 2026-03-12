import { AuthService } from '../../services/index.js';

export default async function Logout(req, res) {
  if (req.user) {
    await AuthService.Logout(req.user?.id);
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return res.status(200).json({ message: 'SUCCESS' });
}
