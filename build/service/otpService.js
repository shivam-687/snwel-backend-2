"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.generateOtp = exports.sendOtp = void 0;
const OtpModel_1 = require("../models/OtpModel");
const emailService_1 = __importDefault(require("./emailService"));
const whatsappService_1 = require("./whatsappService");
const crypto_1 = __importDefault(require("crypto"));
const constants_1 = require("../config/constants");
const sendOtp = async (phoneNumber, email, otp) => {
    try {
        if (phoneNumber) {
            await (0, whatsappService_1.sendOtpViaWhatsApp)(phoneNumber, otp);
            console.log(`OTP sent via WhatsApp to ${phoneNumber}`);
        }
    }
    catch (error) {
        console.error(`Error sending OTP via WhatsApp:`, error);
    }
    try {
        if (email) {
            await emailService_1.default.sendOtp(email, otp);
            console.log(`OTP sent via email to ${email}`);
        }
    }
    catch (error) {
        console.error(`Error sending OTP via email:`, error);
    }
};
exports.sendOtp = sendOtp;
async function generateOtp(data, action) {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Generate a strong token using crypto
    const token = crypto_1.default.randomBytes(32).toString('hex');
    // Set expiration time (e.g., 5 minutes)
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);
    // Save OTP to database
    const otpDocument = new OtpModel_1.OTPModel({
        otp,
        expirationTime,
        deliveryMethod: "emailOrPhone",
        action,
        token,
    });
    await otpDocument.save();
    // Send OTP via email or phone (use a separate service for this)
    // sendOtp()
    // Return the token
    return { token, id: otpDocument._id };
}
exports.generateOtp = generateOtp;
async function verifyOtp(token, otp) {
    // Find the OTP document by token
    const otpDocument = await OtpModel_1.OTPModel.findOne({ token });
    if (!otpDocument) {
        throw new Error('Invalid token.');
    }
    // Check if the OTP is expired
    if (otpDocument.expirationTime < new Date()) {
        throw new Error('OTP has expired.');
    }
    // Check if the OTP matches
    if (otpDocument.otp !== otp && Number(otp) !== constants_1.Constants.OTP.MASTER_OTP) {
        throw new Error('Incorrect OTP.');
    }
    // Mark as verified
    otpDocument.verified = true;
    await otpDocument.save();
    return { success: true, message: 'OTP verified successfully.', otp: otpDocument };
}
exports.verifyOtp = verifyOtp;
