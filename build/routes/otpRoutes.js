"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRouter = void 0;
// routes.ts
const express_1 = __importDefault(require("express"));
const otpController_1 = require("../controllers/otpController");
const router = express_1.default.Router();
exports.OtpRouter = router;
// Route for uploading files
router.post('/generate', otpController_1.generateOtpController);
router.post('/verify', otpController_1.verifyOtpController);
