import { rateLimit } from 'express-rate-limit';

const UploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: { message: 'Too many uploads from this IP, please try again later,' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export default UploadLimiter;
