import mysql2 from 'mysql2/promise';
import { env } from './config.js';

const pool = mysql2.createPool({
  database: env.DB_NAME,
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});

export default pool;
