import { rateLimit } from 'express-rate-limit';
import { ApiError } from '../../utils/apiError';

const PasswordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1,
  keyGenerator: (req, res) => {
    return req.body.email || req.ip;
  },
  handler: (req, res, next, options) =>{
    next(new ApiError(429, 'RATE_LIMIT'));
  }

});

export default PasswordResetLimiter