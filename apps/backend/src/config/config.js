import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  // Core env variables
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3000),
  FRONTEND_URL: z.coerce.string().default('http://localhost:3000'),

  // Database config
  DB_NAME: z.coerce.string().default('your-database'),
  DB_HOST: z.coerce.string().default('localhost'),
  DB_USER: z.coerce.string().default('root'),
  DB_PASSWORD: z.coerce.string().default(''),
  DB_ENCRYPT_SECRET: z.coerce.string().default('your-encryption-secret-here'),
  DB_HASH_PEPPER: z.coerce.string().default('your-hash-pepper-here'),

  // Auth config
  ACCESS_TOKEN_SECRET: z.coerce.string().default('your-access-token-secret-here'),
  REFRESH_TOKEN_SECRET: z.coerce.string().default('your-refresh-token-secret-here'),

  // Mailing config
  MAIL_HOST: z.coerce.string().default('localhost'),
  MAIL_PORT: z.coerce.number().default(587),
  MAIL_USER: z.coerce.string().default('your-user-here'),
  MAIL_PASS: z.coerce.string().default('your-password-here'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = Object.freeze(parsed.data);
