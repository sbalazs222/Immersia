import { mailService } from '../services/index.js';

export async function VerifyEmail(req, res) {
  const token = req.query.token;
  await mailService.confirmAddressReceiveToken(token);
  return res.status(200).json({ message: 'Successful verification.' });
}
