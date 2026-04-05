import { rateLimit } from 'express-rate-limit';
import { ApiError } from '../../utils/apiError.js';

const PasswordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1,
  keyGenerator: (req, res) => {
    if (req.user && req.user.id)
      return `user_${req.user.id}`;

    if (req.body && req.body.email) {
      return `email_${req.body.email}`;
    }
    
    return `${req.ip}`;
  },
  handler: (req, res, next, options) => {
    next(new ApiError(429, 'RATE_LIMIT'));
  }

});

export default PasswordResetLimiter