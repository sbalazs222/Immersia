import transporter from '../../config/transporter.js';
import { AddressConfirmMail } from './mailDesigns.js';

export default function sendConfirmMail(to, link) {
  transporter.sendMail({
    from: 'noreply@immersia.cc',
    to: to,
    subject: 'Email cím megerősítése',
    html: AddressConfirmMail(link),
  });
}
