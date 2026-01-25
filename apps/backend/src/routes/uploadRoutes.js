import { Router } from 'express';
import { uploadMass, uploadSingle } from '../config/multerStorage.js';
import { HandleMassUpload, HandleUpload } from '../controllers/uploadController.js';
import { validateRequiredFields } from 'psgutil';

const UploadRouter = Router();

UploadRouter.post(
  '/newsound',
  uploadSingle.fields([
    { name: 'SoundFile', maxCount: 1 },
    { name: 'ImageFile', maxCount: 1 },
  ]),
  validateRequiredFields(['Title', 'Type']),
  HandleUpload
);

UploadRouter.post('/newarchive', uploadMass.single('Archive'), HandleMassUpload);

export default UploadRouter;
