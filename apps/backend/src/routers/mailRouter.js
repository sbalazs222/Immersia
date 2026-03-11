import { Router } from 'express';
import { MailControllers } from '../controllers/index.js';

const MailRouter = Router();

MailRouter.post('/verify', MailControllers.ConfirmEmailReceive);
MailRouter.post('/resend', MailControllers.ConfirmEmailResend);
MailRouter.post('/pwreset/sendmail', MailControllers.ResetPasswordSend);
MailRouter.post('/pwreset', MailControllers.ResetPasswordReceive);

export default MailRouter;
