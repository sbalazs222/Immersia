import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

const diskStorage = multer.diskStorage({
  destination: '/data/incoming/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = '.' + file.originalname.split('.')[1];
    cb(null, uniqueSuffix + ext);
  },
});

export const uploadMass = multer({
  storage: diskStorage,
  limits: {
    fileSize: 200 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'SoundFile') {
      if (file.mimetype !== 'application/zip' && !file.originalname.endsWith('.zip')) {
        return cb(new ApiError(415, 'UNSUPPORTED_AUDIO_FORMAT'), false);
      }
    }
    cb(null, true);
  },
});

export const uploadSingle = multer({
  storage: diskStorage,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 2,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'SoundFile') {
      if (!['audio/mpeg', 'audio/wav', 'audio/x-wav'].includes(file.mimetype)) {
        return cb(new ApiError(415, 'UNSUPPORTED_AUDIO_FORMAT'), false);
      }
    }
    cb(null, true);
  },
});
