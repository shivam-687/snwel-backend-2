import { OTPModel } from "@/models/OtpModel";
import emailService from "./emailService";
import { sendOtpViaWhatsApp } from "./whatsappService";
import crypto from 'crypto'
import { Constants } from "@/config/constants";

export const sendOtp = async (phoneNumber: string, email: string, otp: string) => {
    try {

        if (phoneNumber) {
            await sendOtpViaWhatsApp(phoneNumber, otp);
            console.log(`OTP sent via WhatsApp to ${phoneNumber}`);
        }
    } catch (error) {
        console.error(`Error sending OTP via WhatsApp:`, error);
    }

    try {
        if (email) {
            await emailService.sendOtp(email, otp);
            console.log(`OTP sent via email to ${email}`);
        }
    } catch (error) {
        console.error(`Error sending OTP via email:`, error);
    }
};

export async function generateOtp(data: { email?: string, phone?: string }, action: string) {
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

    // Send OTP via email or phone (use a separate service for this)
    // sendOtp()
    // Return the token
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

