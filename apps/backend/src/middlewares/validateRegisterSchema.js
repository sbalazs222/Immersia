import { ApiError } from '../utils/apiError.js';

import { validateEmail, validatePassword } from '../validation/index.js';

export default function validateRegisterSchema(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!validateEmail(email)) throw new ApiError(400, 'INCORRECT_EMAIL');
    if (!validatePassword(password)) throw new ApiError(400, 'INCORRECT_PASSWORD');

    next();
  } catch (error) {
    next(error);
  }
}
