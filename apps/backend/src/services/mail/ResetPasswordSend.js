import createMailToken from "../../utils/mail/createMailToken";
import { env } from '../../config/config.js';
import getBlindIndex from "../../utils/emailBlindIndex";
import sendPasswordResetMail from '../../utils/mail/sendPasswordResetMail.js';

export default async function ResetPasswordSend(email, userId) {

  if (!email && userId) {
    const [emailResult] = await pool.query('SELECT AES_DECRYPT(email, ?) as email FROM users WHERE id = ?', [
      env.DB_ENCRYPT_SECRET,
      userId
    ]);
    const token = await createMailToken('password_reset', userId);
    const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;

    sendPasswordResetMail(emailResult[0].email, link);
  }
  if (email && !userId) {
    const blindIndex = getBlindIndex(email);

    const [email] = await pool.query('SELECT AES_DECRYPT(email, ?) as email FROM users WHERE id = ?', [
      env.DB_ENCRYPT_SECRET,
      userId
    ]);

  }




}