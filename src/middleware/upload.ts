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
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: any) => {
  // Allow images, videos, PDFs, and DOC/DOCX files
  if (
    file.mimetype.startsWith('image/') || 
    file.mimetype.startsWith('video/') || 
    file.mimetype === 'application/pdf' || 
    file.mimetype === 'application/msword' || 
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only images, videos, PDFs, and DOC/DOCX files are allowed')); // Reject the file
  }
};
// Multer middleware instance
const upload = multer({
  storage,
  fileFilter
});

export default upload;
