import { Router } from 'express';
import { FavouriteControllers } from '../controllers/index.js';
import { AuthenticateToken } from '../middlewares/index.js';
const FavouriteRouter = Router();

FavouriteRouter.post('/', FavouriteControllers.AddRemoveFavourite);
FavouriteRouter.get('/', FavouriteControllers.GetFavourites);

export default FavouriteRouter;
