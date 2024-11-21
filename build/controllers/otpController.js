"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpController = exports.generateOtpController = void 0;
const otpService_1 = require("../service/otpService");
const appResponse_1 = require("../utils/helpers/appResponse");
const generateOtpController = async (req, res) => {
    try {
        const { email, phone, action } = req.body;
        const { token } = await (0, otpService_1.generateOtp)({ email, phone }, action);
        return (0, appResponse_1.successResponse)({ token }, res);
    }
    catch (error) {
        return (0, appResponse_1.errorResponseFromError)(error, res);
    }
};
exports.generateOtpController = generateOtpController;
const verifyOtpController = async (req, res) => {
    try {
        const token = req.headers['x-otp-token'];
        const { otp } = req.body;
        const result = await (0, otpService_1.verifyOtp)(token, otp);
        return (0, appResponse_1.successResponse)(result, res);
    }
    catch (error) {
        return (0, appResponse_1.errorResponseFromError)(error, res);
    }
};
exports.verifyOtpController = verifyOtpController;
