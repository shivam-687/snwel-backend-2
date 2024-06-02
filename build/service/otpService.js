"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = void 0;
const emailService_1 = __importDefault(require("./emailService"));
const whatsappService_1 = require("./whatsappService");
const sendOtp = async (phoneNumber, email, otp) => {
    try {
        await (0, whatsappService_1.sendOtpViaWhatsApp)(phoneNumber, otp);
        console.log(`OTP sent via WhatsApp to ${phoneNumber}`);
    }
    catch (error) {
        console.error(`Error sending OTP via WhatsApp:`, error);
    }
    try {
        await emailService_1.default.sendOtp(email, otp);
        console.log(`OTP sent via email to ${email}`);
    }
    catch (error) {
        console.error(`Error sending OTP via email:`, error);
    }
};
exports.sendOtp = sendOtp;
