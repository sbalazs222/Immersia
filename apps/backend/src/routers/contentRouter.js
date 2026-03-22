import { Router } from 'express';
import { AuthenticateToken } from '../middlewares/index.js';
import { ContentControllers } from '../controllers/index.js';

const ContentRouter = Router();

ContentRouter.get('/all/:category', /*AuthenticateToken,*/ ContentControllers.GetAll);
ContentRouter.get('/sounds/:slug', /*authenticateToken,*/ ContentControllers.GetSoundData);
ContentRouter.get('/play/:slug', /*authenticateToken,*/ ContentControllers.GetSound);
ContentRouter.get('/thumb/:slug', /*authenticateToken,*/ ContentControllers.GetThumbnail);

export default ContentRouter;
