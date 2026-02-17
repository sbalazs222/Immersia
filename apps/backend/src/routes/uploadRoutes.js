import { Router } from 'express';
import { uploadMass, uploadSingle } from '../config/multerStorage.js';
import { HandleMassUpload, HandleUpload } from '../controllers/uploadController.js';
import { validateRequiredFields } from 'psgutil';
import { uploadLimiter } from '../middlewares/rateLimiter.js';

const UploadRouter = Router();

UploadRouter.post(
  '/newsound',
  uploadLimiter,
  uploadSingle.fields([
    { name: 'SoundFile', maxCount: 1 },
    { name: 'ImageFile', maxCount: 1 },
  ]),
  validateRequiredFields(['Title', 'Type']),
  HandleUpload
);

UploadRouter.post('/newarchive', uploadLimiter, uploadMass.single('Archive'), HandleMassUpload);

export default UploadRouter;
