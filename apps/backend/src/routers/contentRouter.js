import { Router } from 'express';
//import { authenticateToken } from '../middlewares/authentication.js';
import { ContentControllers } from '../controllers/index.js';

const ContentRouter = Router();

ContentRouter.get('/all', /*authenticateToken,*/ ContentControllers.GetAll);
ContentRouter.get('/sounds/:slug', /*authenticateToken,*/ ContentControllers.GetSoundData);
ContentRouter.get('/play/:slug', /*authenticateToken,*/ ContentControllers.GetSound);
ContentRouter.get('/thumb/:slug', /*authenticateToken,*/ ContentControllers.GetThumbnail);

export default ContentRouter;
