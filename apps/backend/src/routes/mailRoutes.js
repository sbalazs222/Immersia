import { Router } from 'express';
import { VerifyEmail, ResendEmail } from '../controllers/mailController.js';

const MailRouter = Router();

MailRouter.post('/verify', VerifyEmail);
MailRouter.post('/resend', ResendEmail);

export default MailRouter;
