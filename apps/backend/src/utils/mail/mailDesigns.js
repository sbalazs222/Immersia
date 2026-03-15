export function AddressConfirmMail(link) {
  return `
    <h1> Immersia </h1>
    <p>A következő linkre kattintva visszaállíthatja a jelszavátó</p>
    <p>Ha nem ön kezdeményezte a regisztrációt nyugodtan figyelmen kívűl hagyhatja ezt a levelet.</p>
    <a href='${link}'> Cím megerősítése </a>
  `;
}

export function PasswordResetMail(link) {
  return `
    <h1> Immersia </h1>
    <p>A következő linkre kattintva megerősítheti email címét.</p>
    <p>Ha nem ön kezdeményezte a regisztrációt nyugodtan figyelmen kívűl hagyhatja ezt a levelet.</p>
    <a href='${link}'> Cím megerősítése </a>
  `;
}
