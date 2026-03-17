import { MailService } from '../../services/index.js';

export default async function ConfirmEmailResend(req, res) {
  const token = req.query.token;
  await MailService.ConfirmEmailResend(token);
  return res.status(200).json({ message: 'SUCCESS' });
}
