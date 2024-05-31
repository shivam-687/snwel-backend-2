import emailService from "./emailService";
import { sendOtpViaWhatsApp } from "./whatsappService";


export const sendOtp = async (phoneNumber: string, email: string, otp: string) => {
    try {
        await sendOtpViaWhatsApp(phoneNumber, otp);
        console.log(`OTP sent via WhatsApp to ${phoneNumber}`);
    } catch (error) {
        console.error(`Error sending OTP via WhatsApp:`, error);
    }

    try {
        await emailService.sendOtp(email, otp);
        console.log(`OTP sent via email to ${email}`);
    } catch (error) {
        console.error(`Error sending OTP via email:`, error);
    }
};