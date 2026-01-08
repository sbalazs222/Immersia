import { Router } from 'express';
import { authenticateToken } from '../middlewares/authentication.js';
import { ServeData } from '../controllers/contentController.js';
const ContentRouter = Router();

ContentRouter.get('/all', ServeData);
ContentRouter.get('/ambiences');
ContentRouter.get('/oneshots');

export default ContentRouter;
