import transporter from '../../config/transporter.js';

export default function sendPasswordResetMail(to, link) {
  transporter.sendMail({
    from: 'noreply@immersia.cc',
    to: to,
    subject: 'Jelszó visszaállítása',
    html: `
      <h1> Immersia </h1>
      <p>A következő linkre kattintva visszaállíthatja a jelszavátó</p>
      <p>Ha nem ön kezdeményezte a regisztrációt nyugodtan figyelmen kívűl hagyhatja ezt a levelet.</p>
      <a href='${link}'> Cím megerősítése </a>
      `,
  });
}
