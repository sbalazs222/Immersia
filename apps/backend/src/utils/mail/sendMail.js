import transporter from '../../config/transporter.js';

export default function sendMail(to, link) {
  transporter.sendMail({
    from: 'noreply@immersia.cc',
    to: to,
    subject: 'Email cím megerősítése',
    html: `
      <h1> Immersia </h1>
      <p>A következő linkre kattintva megerősítheti email címét.</p>
      <p>Ha nem ön kezdeményezte a regisztrációt nyugodtan figyelmen kívűl hagyhatja ezt a levelet.</p>
      <a href='${link}'> Cím megerősítése </a>
      `,
  });
}
