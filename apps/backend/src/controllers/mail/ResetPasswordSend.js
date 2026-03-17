import { MailService } from '../../services/index.js';

export default async function ResetPasswordSend(req, res) {
  const email = req.body.email;
  await MailService.ResetPasswordSend(email, req.user?.id);

  return res.status(200).json({ message: 'SUCCESS' });
}
