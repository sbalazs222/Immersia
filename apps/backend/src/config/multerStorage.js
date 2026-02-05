import multer from 'multer';

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/data/incoming/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = '.' + file.originalname.split('.')[1];
    cb(null, uniqueSuffix + ext);
  },
});

export const upload = multer({ storage: storage });
