"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpEmailTemplate = void 0;
const setting_schema_1 = require("../entity-schema/setting-schema");
const Setting_1 = require("../models/Setting");
const render_1 = require("@react-email/render");
const otpEmail_1 = __importDefault(require("./otpEmail"));
const react_1 = __importDefault(require("react"));
const template = async () => {
    const setting = await Setting_1.SettingModel.findOne({ type: setting_schema_1.SETTINGS.GENERAL });
    const settingData = setting?.data;
};
const otpEmailTemplate = async (otp) => {
    const setting = await Setting_1.SettingModel.findOne({ code: setting_schema_1.SETTINGS.GENERAL });
    const settingData = setting?.data;
    const footerText = `© 2023 ${settingData?.siteName}. All rights reserved.`;
    return {
        template: (0, render_1.render)(react_1.default.createElement(otpEmail_1.default, { otpCode: otp, logoUrl: settingData?.logoUrl || '', footerText: footerText })),
        subject: `Your OTP Code: ${otp} - Complete Your Verification`
    };
};
exports.otpEmailTemplate = otpEmailTemplate;
