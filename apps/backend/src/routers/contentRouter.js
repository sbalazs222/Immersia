import { Router } from 'express';
import { AuthenticateToken, IsAdmin} from '../middlewares/index.js';
import { ContentControllers } from '../controllers/index.js';
import {ValidateContentRequest} from '../middlewares/index.js';

const ContentRouter = Router();

ContentRouter.get('/all/:category', AuthenticateToken, ValidateContentRequest, ContentControllers.GetAll);
ContentRouter.get('/sounds/:slug', AuthenticateToken, ContentControllers.GetSoundData);
ContentRouter.get('/play/:slug', AuthenticateToken, ContentControllers.GetSound);
ContentRouter.get('/thumb/:slug', AuthenticateToken, ContentControllers.GetThumbnail);

ContentRouter.delete('/:slug', AuthenticateToken, IsAdmin, ContentControllers.DeleteSound );

export default ContentRouter;
