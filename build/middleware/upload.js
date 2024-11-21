"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const storage = multer_1.default.memoryStorage();
const cld = cloudinary_1.default.v2.config();
async function handleUpload(file) {
    const res = await cloudinary_1.default.v2.uploader.upload(file, {
        resource_type: "auto",
    });
    return res;
}
exports.handleUpload = handleUpload;
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/') ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    }
    else {
        cb(new Error('Only images, videos, PDFs, and DOC/DOCX files are allowed'));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter
});
exports.default = upload;
