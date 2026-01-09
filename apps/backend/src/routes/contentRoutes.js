import { Router } from 'express';
import { authenticateToken } from '../middlewares/authentication.js';
import { GetThumbnail, PlaySound, ServeData } from '../controllers/contentController.js';
import { GetSoundData } from '../controllers/contentController.js';

const ContentRouter = Router();

ContentRouter.get('/all', /*authenticateToken,*/ ServeData);
ContentRouter.get('/sounds/:slug', /*authenticateToken,*/ GetSoundData);
ContentRouter.get('/play/:slug', /*authenticateToken,*/ PlaySound);
ContentRouter.get('/thumb/:slug', /*authenticateToken,*/ GetThumbnail);

export default ContentRouter;
