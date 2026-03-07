import { MailService } from '../../services/index.js';

export default async function ConfirmEmailReceive(req, res, next) {
  try {
    const token = req.query.token;
    await MailService.ConfirmEmailReceive(token);
    return res.status(200).json({ message: 'SUCCESS' });
  } catch (error) {
    next(error);
  }
}
