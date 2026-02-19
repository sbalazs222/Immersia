import crypto from 'crypto';
import { env } from '../config/config.js';

export default function getBlindIndex(email) {
  return crypto.createHmac('sha256', env.DB_HASH_PEPPER).update(email.toLowerCase().trim()).digest('hex');
}
