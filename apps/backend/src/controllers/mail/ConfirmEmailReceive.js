import { MailService } from '../../services/index.js';
import { ApiError } from '../../utils/apiError.js';

export default async function ConfirmEmailReceive(req, res) {
  const token = req.query.token;
  if (!token) throw new ApiError(400, 'NO_TOKEN');
  await MailService.ConfirmEmailReceive(token);
  return res.status(200).json({ message: 'SUCCESS' });
}
