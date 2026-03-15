import transporter from '../../config/transporter.js';
import { AddressConfirmMail } from './mailDesigns.js';

export default function sendPasswordResetMail(to, link) {
  transporter.sendMail({
    from: 'noreply@immersia.cc',
    to: to,
    subject: 'Jelszó visszaállítása',
    html: AddressConfirmMail(link),
  });
}
