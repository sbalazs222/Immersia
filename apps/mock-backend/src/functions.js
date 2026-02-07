/* eslint-disable prettier/prettier */

import validate from 'psgutil';

const users = [
  {
    id: 'admin@admin.com',
    pass: 'admin'
  },
]

const sounds = [
  {
    title: 'scene1',
    slug: 'scene1',
    type: 'scene',
    loopable: true,
    duration_seconds: 120
  },
  {
    title: 'scene2',
    slug: 'scene2',
    type: 'scene',
    loopable: true,
    duration_seconds: 128
  },
  {
    title: 'oneshot1',
    slug: 'oneshot1',
    type: 'oneshot',
    loopable: false,
    duration_seconds: 3
  },
  {
    title: 'oneshot2',
    slug: 'oneshot2',
    type: 'oneshot',
    loopable: false,
    duration_seconds: 3
  },
  {
    title: 'oneshot3',
    slug: 'oneshot3',
    type: 'oneshot',
    loopable: false,
    duration_seconds: 3
  },{
    title: 'oneshot4',
    slug: 'oneshot4',
    type: 'oneshot',
    loopable: false,
    duration_seconds: 3
  },
  {
    title: 'oneshot5',
    slug: 'oneshot5',
    type: 'oneshot',
    loopable: false,
    duration_seconds: 3
  },
  {
    title: 'oneshot6',
    slug: 'oneshot6',
    type: 'oneshot',
    loopable: false,
    duration_seconds: 3
  },
  {
    title: 'oneshot7',
    slug: 'oneshot7',
    type: 'oneshot',
    loopable: false,
    duration_seconds: 3
  }
]

const CATEGORIES = ['oneshot', 'ambience', 'scene'];

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function Login(req, res) {
  const { email, password } = req.body;
  const user = users.find(item => item.id == email);

  if (!user) return res.status(401).json({ message: 'Invalid username or password!' });
  if (user.pass !== password) return res.status(401).json({ message: 'Invalid username or password!' });

  res.cookie('accessToken', 'accessToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', 'refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ message: 'Successful login.' });
}
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json({ message: 'No token' })
  if (token != 'accessToken') return res.status(401).json({ message: 'Invalid token' });
  next();
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function Register(req, res) {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Missing fields.' });

  if (!validate('email', email)) return res.status(400).json({ message: 'Incorrect email format.' });

  if (users.find(item => item.id == email)) return res.status(409).json({ message: 'Account with address already exists.' });
  users.push({ id: email, pass: password });

  return res.status(201).json({ message: 'Successful registration.' });
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function Refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh Token required.' });

  if (refreshToken !== 'refreshToken') return res.status(401).json({ message: 'Invalid refresh token.' });

  res.cookie('accessToken', 'accessToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });
  return res.status(200).json({ message: 'Successful refresh' });
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function Verify(req, res) {
  return res.status(200).json({ message: 'Successful verification.' });
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function Logout(req, res) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.status(200).json({ message: 'Successful logout' });
}


export function All(req, res) {

  const category = req.query.c;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;


  if (!CATEGORIES.includes(category)) return res.status(400).json({ message: 'Invalid or missing category' });

  const soundsInCategory = sounds.filter(item=> item.type == category);
  const total = soundsInCategory.length;

  let temp = [];
  console.log(`page: ${page}, limit: ${offset+limit > total ? total: offset+limit}, offset: ${offset}, total: ${total}`)
  for (let i = offset; i <= offset+limit; i++) {
    if (i > total-1) {
      break;
    }
    console.log(soundsInCategory[i])
    temp.push(soundsInCategory[i]);
    console.log(`i: ${i}`)
  }

  return res.status(200).json({
    data: temp,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export function Sound() { } export function Play() { } export function Thumb() { } export function NewSound() { } export function NewArchive() { }