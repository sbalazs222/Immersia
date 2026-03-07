import { ContentService } from '../../services/index.js';

export default async function GetAll(req, res, next) {
  try {
    const result = await ContentService.GetSoundsByCategory(
      req.query.c,
      parseInt(req.query.page) || 1,
      parseInt(req.query.limit) || 10
    );

    return res.status(200).json({ message: 'SUCCESS', data: result.rows, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
}
