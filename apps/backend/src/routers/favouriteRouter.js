import { Router } from 'express';
import { FavouriteControllers } from '../controllers/index.js';
import { AuthenticateToken } from '../middlewares/index.js';
const FavouriteRouter = Router();

FavouriteRouter.post('/favourite', AuthenticateToken, FavouriteControllers.AddRemoveFavourite);
FavouriteRouter.get('/favourites', AuthenticateToken, FavouriteControllers.GetFavourites);

export default FavouriteRouter;
