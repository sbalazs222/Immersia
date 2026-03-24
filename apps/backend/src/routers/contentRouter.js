import { Router } from 'express';
import { AuthenticateToken, IsAdmin} from '../middlewares/index.js';
import { ContentControllers } from '../controllers/index.js';
import {ValidateContentRequest} from '../middlewares/index.js';

const ContentRouter = Router();

ContentRouter.get('/all/:category', /*AuthenticateToken,*/ ValidateContentRequest, ContentControllers.GetAll);
ContentRouter.get('/sounds/:slug', /*authenticateToken,*/ ContentControllers.GetSoundData);
ContentRouter.get('/play/:slug', /*authenticateToken,*/ ContentControllers.GetSound);
ContentRouter.get('/thumb/:slug', /*authenticateToken,*/ ContentControllers.GetThumbnail);

ContentRouter.delete('/:slug', /*AuthenticateToken, IsAdmin,*/ContentControllers.DeleteSound );

export default ContentRouter;
