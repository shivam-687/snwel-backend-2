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
    // Allow only specific file types, you can customize this according to your requirements
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only images and videos are allowed'));
    }
};
// Multer middleware instance
const upload = (0, multer_1.default)({
    storage,
    fileFilter
});
exports.default = upload;
