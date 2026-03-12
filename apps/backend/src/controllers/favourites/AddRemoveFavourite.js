import { FavouriteService } from '../../services/index.js';

export default async function AddRemoveFavourite(req, res, next) {
  const userId = req.user.id;
  const slug = req.body.slug;

  await FavouriteService.AddRemoveFavourite(userId, slug);

  return req.status(200).json({message: 'SUCCESS'});
}