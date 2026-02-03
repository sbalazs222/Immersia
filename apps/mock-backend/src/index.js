/* eslint-disable prettier/prettier */
import express from 'express';
import cors from 'cors';
import { colorLog, errorLog, validateFieldCount, validateRequiredFields } from 'psgutil';
import { ConsoleColor as cc } from 'psgutil';
import cookieParser from 'cookie-parser';
import { Login } from './functions.js';

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(colorLog());

app.post('/auth/login', validateRequiredFields(['email', 'password']), validateFieldCount(2), Login);
app.post('/auth/register', Register);
app.post('/auth/refresh', Refresh);
app.post('/auth/verify', Verify);
app.post('/auth/logout', Logout);

app.get('/content/all', All);
app.get('/content/sounds/:slug', Sound);
app.get('/content/play/{slug}', Play);
app.get('/content/thumb/{slug}', Thumb);

app.post('/upload/newsound', NewSound);
app.post('/upload/newarchive', NewArchive);


app.listen(3000, () => {
  console.log(`${cc.cyan}Server running on port ${cc.yellow}3000${cc.reset}`);
});
app.use(errorLog());
