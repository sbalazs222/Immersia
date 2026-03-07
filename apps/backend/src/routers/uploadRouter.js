import { Router } from 'express';
import { uploadMass, uploadSingle } from '../config/multerStorage.js';
import { HandleMassUpload, HandleUpload } from '../controllers/uploadController.js';
import { ValidateRequiredFields, UploadLimiter } from '../middlewares/index.js';

const UploadRouter = Router();

UploadRouter.post(
  '/newsound',
  UploadLimiter,
  uploadSingle.fields([
    { name: 'SoundFile', maxCount: 1 },
    { name: 'ImageFile', maxCount: 1 },
  ]),
  ValidateRequiredFields(['Title', 'Type']),
  HandleUpload
);

UploadRouter.post('/newarchive', UploadLimiter, uploadMass.single('Archive'), HandleMassUpload);

export default UploadRouter;
