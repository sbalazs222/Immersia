import { Router } from 'express';
import { upload } from '../config/multerStorage.js';
import { HandleUpload } from '../controllers/uploadController.js';

const UploadRouter = Router();

UploadRouter.post(
  '/newsound',
  upload.fields([
    { name: 'SoundFile', maxCount: 1 },
    { name: 'ImageFile', maxCount: 1 },
  ]),
  HandleUpload
);

export default UploadRouter;
