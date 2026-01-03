import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3000),
  DB_NAME: z.coerce.string().default('your-database'),
  DB_HOST: z.coerce.string().default('localhost'),
  DB_USER: z.coerce.string().default('root'),
  DB_PASSWORD: z.coerce.string().default(''),
  ACCESS_TOKEN_SECRET: z.coerce.string().default('your-access-token-secret-here'),
  REFRESH_TOKEN_SECRET: z.coerce.string().default('your-refresh-token-secret-here'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = Object.freeze(parsed.data);
