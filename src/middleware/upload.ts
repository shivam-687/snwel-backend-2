// multerMiddleware.ts
import multer from 'multer';
import cloudinary from 'cloudinary';


// Multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
//     cb(null, './uploads/');
//   },
//   filename: function (req: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) {
//     const extension = path.extname(file.originalname);
//     const fileName = `${Date.now()}${extension}`;
//     cb(null, fileName);
//   }
// });

const storage = multer.memoryStorage();

const cld = cloudinary.v2.config();

  export async function handleUpload(file: any) {
    const res = await cloudinary.v2.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
  }

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
const upload = multer({
  storage,
  fileFilter
});

export default upload;
