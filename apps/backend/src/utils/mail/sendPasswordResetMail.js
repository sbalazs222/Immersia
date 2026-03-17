import transporter from '../../config/transporter.js';
import { PasswordResetMail } from './mailDesigns.js';

export default function sendPasswordResetMail(to, link) {
  transporter.sendMail({
    from: 'noreply@immersia.cc',
    to: to,
    subject: 'Jelszó visszaállítása',
    html: PasswordResetMail(link),
  });
}
