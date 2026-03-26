import { ContentService } from '../../services/index.js';

export default async function DeleteSound(req, res) {
  const slug = req.params.slug;

  const result = await ContentService.DeleteSound(slug);
  
  return res.status(200).json({ message: 'SUCCESS', data: result });
}
