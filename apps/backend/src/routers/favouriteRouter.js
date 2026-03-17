import { Router } from 'express';
import { FavouriteControllers } from '../controllers/index.js';
import { AuthenticateToken } from '../middlewares/index.js';
const FavouriteRouter = Router();

FavouriteRouter.post('/', AuthenticateToken, FavouriteControllers.AddRemoveFavourite);
FavouriteRouter.get('/', AuthenticateToken, FavouriteControllers.GetFavourites);

export default FavouriteRouter;
