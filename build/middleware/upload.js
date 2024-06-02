"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// multerMiddleware.ts
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const path_1 = __importDefault(require("path"));
// Multer storage configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const extension = path_1.default.extname(file.originalname);
        const fileName = `${Date.now()}${extension}`;
        cb(null, fileName);
    }
});
cloudinary_1.default.v2.config();
const cld_storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default.v2,
    params: {}
});
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
const upload = (0, multer_1.default)({ storage: cld_storage, fileFilter: fileFilter });
exports.default = upload;
