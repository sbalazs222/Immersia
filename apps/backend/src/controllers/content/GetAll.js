import { ContentService } from '../../services/index.js';

export default async function GetAll(req, res) {
  //TODO: input validation
  const result = await ContentService.GetSoundsByCategory(
    req.params.category,
    parseInt(req.query.page) || 1,
    parseInt(req.query.limit) || 10,
    req.user?.id
  );

  return res.status(200).json({ message: 'SUCCESS', data: result.rows, pagination: result.pagination });
}
