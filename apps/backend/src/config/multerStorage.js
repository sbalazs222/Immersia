import multer from 'multer';

export const storageSingle = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/data/incoming/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = '.' + file.originalname.split('.')[1];
    cb(null, uniqueSuffix + ext);
  },
});

export const storageMass = multer.diskStorage({
  destination: '/data/incoming/',
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 2,
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = '.' + file.originalname.split('.')[1];
    cb(null, uniqueSuffix + ext);
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldame === 'SoundFile') {
      if (!['audio/mpeg', 'audio/wav', 'audio/x-wav'].includes(file.mimetype)) {
        return cb(new Error('Invalid audio type'), false);
      }
    }
    cb(null, true);
  },
});

export const uploadSingle = multer({ storage: storageSingle });
export const uploadMass = multer({ storage: storageMass });
