"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpload = void 0;
// multerMiddleware.ts
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
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
const storage = multer_1.default.memoryStorage();
const cld = cloudinary_1.default.v2.config();
async function handleUpload(file) {
    const res = await cloudinary_1.default.v2.uploader.upload(file, {
        resource_type: "auto",
    });
    return res;
}
exports.handleUpload = handleUpload;
// Multer file filter
const fileFilter = (req, file, cb) => {
    // Allow images, videos, PDFs, and DOC/DOCX files
    if (file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/') ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true); // Accept the file
    }
    else {
        cb(new Error('Only images, videos, PDFs, and DOC/DOCX files are allowed')); // Reject the file
    }
};
// Multer middleware instance
const upload = (0, multer_1.default)({
    storage,
    fileFilter
});
exports.default = upload;
