"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadV2 = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const stream_1 = require("stream");
// Multer configuration with memory storage
const storage = multer_1.default.memoryStorage();
// File filter for allowed file types
const fileFilter = (req, file, cb) => {
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
// Multer middleware instance for multiple files
const uploadV2 = (0, multer_1.default)({
    storage,
    fileFilter,
}).array('files', 10); // Accept up to 10 files at once
exports.default = uploadV2;
// Cloudinary configuration
cloudinary_1.default.v2.config();
// Helper function to handle Cloudinary upload
const handleUploadV2 = async (fileBuffer, mimetype) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.v2.uploader.upload_stream({ resource_type: 'auto' }, // 'auto' detects the file type (image, video, etc.)
        (error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        });
        // Convert buffer to readable stream
        const readableStream = new stream_1.Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null); // End of stream
        readableStream.pipe(uploadStream);
    });
};
exports.handleUploadV2 = handleUploadV2;
