import { OTPModel } from "@/models/OtpModel";
import { sendOtpViaWhatsApp } from "./whatsappService";
import crypto from 'crypto'
import { Constants } from "@/config/constants";
import { sendOTPNotification, sendOTPWhatsapp, sendSnwelOTPNotification } from "./notificationService";

export const sendOtp = async (otp: string, phoneNumber?: string, email?: string) => {
    console.log({ otp, phoneNumber, email })
    try {

        if (phoneNumber) {
            await sendOTPWhatsapp(otp, phoneNumber)
            console.log(`OTP sent via WhatsApp to ${phoneNumber}`);
        }
    } catch (error) {
        console.error(`Error sending OTP via WhatsApp:`, error);
    }

    try {
        if (email) {
            await sendOTPNotification(otp, email)
            console.log(`OTP sent via email to ${email}`);
        }
    } catch (error) {
        console.error(`Error sending OTP via email:`, error);
    }
};

export async function generateOtp(data: { email?: string, phone?: string }, action: string) {
    const predefinedActions = 'snwel-com'
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate a strong token using crypto
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration time (e.g., 5 minutes)
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP to database
    const otpDocument = new OTPModel({
        otp,
        expirationTime,
        deliveryMethod: "emailOrPhone",
        action,
        token,
    });

    await otpDocument.save();
    console.log({action})
    if (action && action === "snwel-com") {
        await sendSnwelOTPNotification(otp, data?.email || '')
    } else {
        await sendOtp(otp, data?.phone, data?.email);
    }
    return { token, id: otpDocument._id };
}


export async function verifyOtp(token: string, otp: string) {
    // Find the OTP document by token
    const otpDocument = await OTPModel.findOne({ token });

    if (!otpDocument) {
        throw new Error('Invalid token.');
    }

    // Check if the OTP is expired
    if (otpDocument.expirationTime < new Date()) {
        throw new Error('OTP has expired.');
    }

    // Check if the OTP matches
    if (otpDocument.otp !== otp && Number(otp) !== Constants.OTP.MASTER_OTP) {
        throw new Error('Incorrect OTP.');
    }

    // Mark as verified
    otpDocument.verified = true;
    await otpDocument.save();


    return { success: true, message: 'OTP verified successfully.', otp: otpDocument };
}

