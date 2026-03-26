import { MailService } from '../../services/index.js';
import { ApiError } from '../../utils/apiError.js';

export default async function ResetPasswordReceive(req, res) {
  const token = req.query.token;
  const newPassword = req.body.password;
  if (!token) throw new ApiError(400, 'NO_TOKEN');
  if (!newPassword) throw new ApiError(400, 'MISSING_FIELD');
  await MailService.ResetPasswordReceive(token, newPassword);
  return res.status(200).json({ message: 'SUCCESS' });
}
