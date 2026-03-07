import { env } from './config.js';

const COOKIE_CONFIG = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000, // 15 minutes
};

export default COOKIE_CONFIG;
