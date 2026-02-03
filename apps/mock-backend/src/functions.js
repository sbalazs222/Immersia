/* eslint-disable prettier/prettier */
/**
 * 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns 
 */
export function Login(req, res, next) {
  const { email, password } = req.body;

  if (email != 'admin@admin.com') return res.status(404).json({ message: 'Invalid username or password!' });
  if (password != 'admin') return res.status(404).json({ message: 'Invalid username or password!' });


  res.cookie('accessToken', 'token1', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', 'token2', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ message: 'Successful login.' });
}