// multerMiddleware.ts
import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
    cb(null, './uploads/');
  },
  filename: function (req: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) {
    const extension = path.extname(file.originalname);
    const fileName = `${Date.now()}${extension}`;
    cb(null, fileName);
  }
});

cloudinary.v2.config();

const cld_storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {}
  });

// Multer file filter
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: any) => {
  // Allow only specific file types, you can customize this according to your requirements
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'));
  }
};

// Multer middleware instance
const upload = multer({ storage: cld_storage, fileFilter: fileFilter });

export default upload;
