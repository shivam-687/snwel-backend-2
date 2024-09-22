import { Request, Response } from "express";
import { generateOtp, verifyOtp } from "@/service/otpService";
import { successResponse, errorResponseFromError } from "@/utils/helpers/appResponse";

// Controller to handle OTP generation
export const generateOtpController = async (req: Request, res: Response) => {
    try {
        const { email, phone, action } = req.body;
        const { token } = await generateOtp({email, phone}, action);
        return successResponse({ token }, res);
    } catch (error) {
        return errorResponseFromError(error, res);
    }
}

// Controller to handle OTP verification
export const verifyOtpController = async (req: Request, res: Response) => {
    try {
        const token = req.headers['x-otp-token']; // Assuming token is sent in headers
        const { otp } = req.body;
        const result = await verifyOtp(token as string, otp);
        return successResponse(result, res);
    } catch (error) {
        return errorResponseFromError(error, res);
    }
}



