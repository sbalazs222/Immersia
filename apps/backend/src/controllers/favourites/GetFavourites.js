import { FavouriteService } from '../../services/index.js';

export default async function GetFavourites(req, res, next) {
  const result = await FavouriteService.GetFavourites(req.user.id);
  return res.status(200).json({ message: 'SUCCESS', data: result });
}
