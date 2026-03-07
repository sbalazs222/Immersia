import { MailService } from '../../services/index.js';

export default async function ConfirmEmailResend(req, res, next) {
  try {
    const token = req.query.token;
    await MailService.ConfirmEmailResend(token);
    return res.status(200).json({ message: 'SUCCESS' });
  } catch (error) {
    next(error);
  }
}
