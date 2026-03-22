import { Router } from 'express';
import { uploadMass, uploadSingle } from '../config/multerStorage.js';
import { ValidateRequiredFields, UploadLimiter, ValidateSingleUpload, AuthenticateToken, IsAdmin } from '../middlewares/index.js';
import { UploadControllers } from '../controllers/index.js';

const UploadRouter = Router();

UploadRouter.post(
  '/sound',
  /*AuthenticateToken,
  IsAdmin,*/
  /*UploadLimiter,*/
  uploadSingle.fields([
    { name: 'SoundFile', maxCount: 1 },
    { name: 'SoundFileCombat', maxCount: 1 },
    { name: 'SoundFileExplore', maxCount: 1 },
    { name: 'ImageFile', maxCount: 1 },
  ]),
  ValidateRequiredFields(['Title', 'Type']),
  ValidateSingleUpload,
  UploadControllers.UploadSingle
);

UploadRouter.post('/archive', /*UploadLimiter, AuthenticateToken, IsAdmin,*/ uploadMass.single('Archive'), UploadControllers.UploadArchive);

export default UploadRouter;
