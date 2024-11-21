"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.generateOtp = exports.sendOtp = void 0;
const OtpModel_1 = require("../models/OtpModel");
const crypto_1 = __importDefault(require("crypto"));
const constants_1 = require("../config/constants");
const notificationService_1 = require("./notificationService");
const sendOtp = async (otp, phoneNumber, email) => {
    console.log({ otp, phoneNumber, email });
    try {
        if (phoneNumber) {
            await (0, notificationService_1.sendOTPWhatsapp)(otp, phoneNumber);
            console.log(`OTP sent via WhatsApp to ${phoneNumber}`);
        }
    }
    catch (error) {
        console.error(`Error sending OTP via WhatsApp:`, error);
    }
    try {
        if (email) {
            await (0, notificationService_1.sendOTPNotification)(otp, email);
            console.log(`OTP sent via email to ${email}`);
        }
    }
    catch (error) {
        console.error(`Error sending OTP via email:`, error);
    }
};
exports.sendOtp = sendOtp;
async function generateOtp(data, action) {
    const predefinedActions = 'snwel-com';
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);
    const otpDocument = new OtpModel_1.OTPModel({
        otp,
        expirationTime,
        deliveryMethod: "emailOrPhone",
        action,
        token,
    });
    await otpDocument.save();
    console.log({ action });
    if (action && action === "snwel-com") {
        await (0, notificationService_1.sendSnwelOTPNotification)(otp, (data === null || data === void 0 ? void 0 : data.email) || '');
    }
    else {
        await (0, exports.sendOtp)(otp, data === null || data === void 0 ? void 0 : data.phone, data === null || data === void 0 ? void 0 : data.email);
    }
    return { token, id: otpDocument._id };
}
exports.generateOtp = generateOtp;
async function verifyOtp(token, otp) {
    const otpDocument = await OtpModel_1.OTPModel.findOne({ token });
    if (!otpDocument) {
        throw new Error('Invalid token.');
    }
    if (otpDocument.expirationTime < new Date()) {
        throw new Error('OTP has expired.');
    }
    if (otpDocument.otp !== otp && Number(otp) !== constants_1.Constants.OTP.MASTER_OTP) {
        throw new Error('Incorrect OTP.');
    }
    otpDocument.verified = true;
    await otpDocument.save();
    return { success: true, message: 'OTP verified successfully.', otp: otpDocument };
}
exports.verifyOtp = verifyOtp;
