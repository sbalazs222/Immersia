import express from 'express';
import cp from 'cookie-parser'; 
import cors from 'cors';
import { env } from './config.js';
import {colorLog, errorLog} from 'psgutil';

const app = express();
const corsOptions = {
    credentials: true,
    origin: config.FRONTEND_URL || `http://localhost:${env.PORT}`,
}


app.use(cp());
app.use(cors(corsOptions));
app.use(colorLog);
app.use(express.json());



app.use(errorLog);
app.listen(env.PORT, () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
});
