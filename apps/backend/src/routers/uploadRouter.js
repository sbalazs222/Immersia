import { Router } from 'express';
import { uploadMass, uploadSingle } from '../config/multerStorage.js';
import { ValidateRequiredFields, UploadLimiter } from '../middlewares/index.js';
import { UploadControllers } from '../controllers/index.js';

const UploadRouter = Router();

UploadRouter.post(
  '/sound',
  UploadLimiter,
  uploadSingle.fields([
    { name: 'SoundFile', maxCount: 1 },
    { name: 'ImageFile', maxCount: 1 },
  ]),
  ValidateRequiredFields(['Title', 'Type']),
  UploadControllers.UploadSingle
);

UploadRouter.post('/archive', UploadLimiter, uploadMass.single('Archive'), UploadControllers.UploadArchive);

export default UploadRouter;
