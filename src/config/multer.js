import multer from 'multer';
import storage from './cloudinary';

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb({ message: 'Unsupported File Format' }, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
