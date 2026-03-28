import { ContentService } from '../../services/index.js';

export default async function DeleteSound(req, res) {
  const slugs = req.body.slugs;

  const result = await ContentService.DeleteSound(slugs);
  
  return res.status(200).json({ message: 'SUCCESS', data: result });
}
