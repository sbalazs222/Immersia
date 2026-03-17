import { AuthService } from '../../services/index.js';

export default async function Register(req, res) {
  const { email, password } = req.body;

  await AuthService.Register(email, password);
  return res.status(201).json({ message: 'SUCCESS' });
}
