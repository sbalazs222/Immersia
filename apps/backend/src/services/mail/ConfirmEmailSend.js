import { env } from '../../config/config.js';
import createMailToken from '../../utils/mail/createMailTOken.js';
import { sendConfirmMail } from '../../utils/mail/sendConfirmMail.js';

export default async function ConfirmEmailSend(email, userId) {
  const token = await createMailToken('confirm', userId);
  const link = `${env.FRONTEND_URL}/verify?token=${token}`;
  sendConfirmMail(email, link);
  return;
}
