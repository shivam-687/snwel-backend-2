"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpViaWhatsApp = exports.loadSetting = void 0;
// services/whatsappService.ts
const setting_schema_1 = require("../entity-schema/setting-schema");
const Setting_1 = require("../models/Setting");
const axios_1 = __importDefault(require("axios"));
const loadSetting = async (code) => {
    try {
        const setting = await Setting_1.SettingModel.findOne({ code });
        if (!setting) {
            throw new Error(`Setting with code ${code} not found`);
        }
        return setting.data;
    }
    catch (error) {
        console.error(`Error loading setting with code ${code}:`, error);
        throw error;
    }
};
exports.loadSetting = loadSetting;
const sendWhatsAppMessage = async (phoneNumber, message) => {
    const settings = await (0, exports.loadSetting)(setting_schema_1.SETTINGS.INTEGRATION);
    const whatsappSettings = settings.data.whatsapp;
    if (!whatsappSettings) {
        throw new Error('WhatsApp settings not found');
    }
    try {
        const response = await axios_1.default.post(whatsappSettings.url, {
            appKey: whatsappSettings.appKey,
            authKey: whatsappSettings.authKey,
            to: phoneNumber,
            message: message,
        });
        return response.data;
    }
    catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
};
const sendOtpViaWhatsApp = async (phoneNumber, otp) => {
    const message = `Your OTP code is ${otp}`;
    return await sendWhatsAppMessage(phoneNumber, message);
};
exports.sendOtpViaWhatsApp = sendOtpViaWhatsApp;
