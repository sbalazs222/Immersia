import { env } from '../../config/config.js';
import createMailToken from '../../utils/mail/createMailTOken.js';
import sendMail from '../../utils/mail/sendMail.js';

export default async function ConfirmEmailSend(email, userId) {
  const token = await createMailToken('confirm', userId);
  const link = `${env.FRONTEND_URL}/verify?token=${token}`;
  sendMail(email, link);
}
