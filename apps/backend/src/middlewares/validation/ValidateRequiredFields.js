import { ApiError } from '../../utils/apiError.js';

export default function ValidateRequiredFields(fields) {
  return (req, res, next) => {
    if (req.body == null || typeof req.body !== 'object') throw new ApiError(400, 'INVALID_BODY');

    for (const field of fields) {
      if (!req.body[field] && req.body[field] !== 0) throw new ApiError(400, 'MISSING_FIELDS');
    }
    next();
  };
}
