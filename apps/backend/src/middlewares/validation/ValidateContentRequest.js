import { ApiError } from "../../utils/apiError.js";

export default function ValidateContentRequest(req, res, next) {
  const category = req.params.category;
  let { page, limit, search } = req.query;

  if (!category) throw new ApiError(400, 'MISSING_CATEGORY');
  if (!['oneshot', 'ambience', 'scene'].includes(category)) throw new ApiError(400, 'INVALID_CATEGORY');

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  req.data = { category, page, limit, search };
  next();
}