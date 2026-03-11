import { MailService } from '../../services/index.js';

export default async function ResetPasswordSend(req, res, next) {
  const { email } = req.body.email;


  await MailService.ResetPasswordSend(email);

  return res.status(200).json({ message: 'SUCCESS' });
}