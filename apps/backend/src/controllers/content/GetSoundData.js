import { ContentService } from '../../services/index.js';

export default async function GetSoundData(req, res) {
  const result = await ContentService.GetSoundBySlug(req.params.slug);
  return res.status(200).json({ message: 'SUCCESS', data: result });
}
