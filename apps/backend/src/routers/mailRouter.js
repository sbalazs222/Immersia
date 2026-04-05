import { Router } from 'express';
import { MailControllers } from '../controllers/index.js';
import { OptionalAuthenticateToken, PasswordResetLimiter } from '../middlewares/index.js';

const MailRouter = Router();

MailRouter.post('/verify', MailControllers.ConfirmEmailReceive);
MailRouter.post('/resend', MailControllers.ConfirmEmailResend);
MailRouter.post('/pwreset/sendmail', OptionalAuthenticateToken, PasswordResetLimiter, MailControllers.ResetPasswordSend);
MailRouter.post('/pwreset', MailControllers.ResetPasswordReceive);

export default MailRouter;
