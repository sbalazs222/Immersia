import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { env } from './config/config.js';
import { colorLog } from 'psgutil';

import AuthRouter from './routes/authRoutes.js';
import ContentRouter from './routes/contentRoutes.js';
import UploadRouter from './routes/uploadRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const corsOptions = {
  credentials: true,
  origin: env.NODE_ENV == 'development' ? '*' : env.FRONTEND_URL,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(colorLog);
app.use(express.json());

app.use('/auth', AuthRouter);
app.use('/content', ContentRouter);
app.use('/upload', UploadRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
});
