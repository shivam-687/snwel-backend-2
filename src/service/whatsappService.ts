// services/whatsappService.ts
import { IntegrationSetting, SETTINGS } from '@/entity-schema/setting-schema';
import { SettingModel } from '@/models/Setting';
import axios from 'axios';


export const loadSetting = async (code: string) => {
    try {
        const setting = await SettingModel.findOne({ code });
        if (!setting) {
            throw new Error(`Setting with code ${code} not found`);
        }
        return setting.data;
    } catch (error) {
        console.error(`Error loading setting with code ${code}:`, error);
        throw error;
    }
};

const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
    const settings = await loadSetting(SETTINGS.INTEGRATION) as IntegrationSetting;

    const whatsappSettings = settings.data.whatsapp;
    if (!whatsappSettings) {
        throw new Error('WhatsApp settings not found');
    }
    try {
        const response = await axios.post(whatsappSettings.url, {
            appKey: whatsappSettings.appKey,
            authKey: whatsappSettings.authKey,
            to: phoneNumber,
            message: message,
        });
        return response.data;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
};

export const sendOtpViaWhatsApp = async (phoneNumber: string, otp: string) => {
    const message = `Your OTP code is ${otp}`;
    return await sendWhatsAppMessage(phoneNumber, message);
};
