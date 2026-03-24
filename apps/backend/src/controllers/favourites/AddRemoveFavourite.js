import { FavouriteService } from '../../services/index.js';

export default async function AddRemoveFavourite(req, res) {
  const userId = req.user.id;
  const slug = req.body.slug;

  await FavouriteService.AddRemoveFavourite(userId, slug);

  return res.status(200).json({ message: 'SUCCESS' });
}
