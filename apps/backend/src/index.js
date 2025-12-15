import express from 'express';
import { env } from './config.js';
import { sharedHello } from '@repo/shared';

const app = express();

app.get('/', (_, res) => res.send(sharedHello()));

app.listen(env.PORT, () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
});
