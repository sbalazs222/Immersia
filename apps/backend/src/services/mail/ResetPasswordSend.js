import createMailToken from '../../utils/mail/createMailToken.js';
import { env } from '../../config/config.js';
import pool from '../../config/mysql.js';
import getBlindIndex from '../../utils/emailBlindIndex.js';
import sendPasswordResetMail from '../../utils/mail/sendPasswordResetMail.js';
import { ApiError } from '../../utils/apiError.js';

export default async function ResetPasswordSend(emailParam, userIdParam) {
  let email = emailParam;
  let userId = userIdParam;
  if (!email && !userId) throw new ApiError(400, 'MISSING_FIELDS');

  if (!email && userId) {
    email = (
      await pool.query('SELECT CAST(AES_DECRYPT(email, ?) AS CHAR) AS email FROM users WHERE id = ?', [
        env.DB_ENCRYPT_SECRET,
        userId,
      ])
    )[0][0].email;
  }

  if (email && !userId) {
    const blindIndex = getBlindIndex(email);

    const user = (await pool.query('SELECT id FROM users WHERE email_blind_index = ?;', [blindIndex]))[0][0];

    if (!user) throw new ApiError(404, 'NO_ACCOUNT');
    userId = user.id
  }

  const token = await createMailToken('password_reset', userId);
  const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;

  sendPasswordResetMail(email, link);
}
