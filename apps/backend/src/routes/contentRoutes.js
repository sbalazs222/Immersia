import { Router } from 'express';
import { authenticateToken } from '../middlewares/authentication.js';
import { ServeData } from '../controllers/contentController.js';
import { GetSoundData } from '../controllers/contentController.js';

const ContentRouter = Router();

ContentRouter.get('/all', ServeData);
ContentRouter.get('/sounds/:slug', GetSoundData);

export default ContentRouter;
