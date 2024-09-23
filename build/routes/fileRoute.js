"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRouter = void 0;
// routes.ts
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("../middleware/upload"));
const uploadV2_1 = __importDefault(require("../middleware/uploadV2"));
const fileController_1 = require("../controllers/fileController");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
exports.FileRouter = router;
// Route for uploading files
router.post('/upload-multi', passport_1.default.authenticate('jwt', { session: false }), uploadV2_1.default, // Use the Multer middleware
fileController_1.uploadFileV2Controller // Controller to handle file uploads
);
router.post('/upload', passport_1.default.authenticate('jwt', { session: false }), upload_1.default.single('file'), fileController_1.uploadFile);
// Route for listing files
router.get('/files', passport_1.default.authenticate('jwt', { session: false }), fileController_1.listFiles);
