import { ContentService } from '../../services/index.js';

export default async function GetAll(req, res) {
  const result = await ContentService.GetSoundsByCategory(
    req.data.category,
    req.data.page,
    req.data.limit,
    req.user?.id
  );

  return res.status(200).json({ message: 'SUCCESS', data: result.rows, pagination: result.pagination });
}
