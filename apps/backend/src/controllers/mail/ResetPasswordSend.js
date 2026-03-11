import { MailService } from '../../services/index.js';

export default async function ResetPasswordSend(req, res, next) {
  await MailService.ResetPasswordSend();

  return res.status(200).json({ message: 'SUCCESS' });
}