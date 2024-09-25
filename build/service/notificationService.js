"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const setting_schema_1 = require("../entity-schema/setting-schema");
const Setting_1 = require("../models/Setting");
const axios_1 = __importDefault(require("axios"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class NotificationService {
    // Private constructor to prevent direct instantiation
    constructor() { }
    // Get the singleton instance
    static async getInstance() {
        if (!NotificationService.instance) {
            const instance = new NotificationService();
            await instance.loadSettings(); // Load settings when instance is first created
            NotificationService.instance = instance;
            console.log("Load setting successfully");
        }
        return NotificationService.instance;
    }
    // Load settings from the database (this would typically call your database or config service)
    async loadSettings() {
        // Simulate loading settings from the database
        this.emailSetting = await this.loadEmailSettingsFromDB();
        this.integrationSetting = await this.loadIntegrationSettingsFromDB();
    }
    // Load email settings from DB (replace this with actual DB call)
    async loadEmailSettingsFromDB() {
        const emailSetting = await Setting_1.SettingModel.findOne({ code: setting_schema_1.SETTINGS.EMAIL });
        return emailSetting;
    }
    // Load integration (WhatsApp) settings from DB (replace this with actual DB call)
    async loadIntegrationSettingsFromDB() {
        const emailSetting = await Setting_1.SettingModel.findOne({ code: setting_schema_1.SETTINGS.INTEGRATION });
        return emailSetting;
    }
    // Refresh settings manually
    async refreshSettings() {
        await this.loadSettings();
        console.log('Settings refreshed');
    }
    // Send Email Notification
    async sendEmail(to, subject, message) {
        if (!this.emailSetting || !this.emailSetting.data) {
            throw new Error("Email settings not configured");
        }
        const emailTransporter = this.emailSetting.data[setting_schema_1.EMAIL_TRANSPORTER.NODEMAILER];
        if (!emailTransporter) {
            throw new Error("Email transporter is not configured");
        }
        if (this.emailSetting.data[setting_schema_1.EMAIL_TRANSPORTER.NODEMAILER]) {
            console.log("Start sending mail to", to);
            const transporter = nodemailer_1.default.createTransport({
                host: emailTransporter.host,
                port: parseInt(emailTransporter.port),
                secure: emailTransporter.secure,
                auth: {
                    user: emailTransporter.auth.user,
                    pass: emailTransporter.auth.pass
                },
                tls: {
                    rejectUnauthorized: false, // Add this only for testing environments; avoid using it in production
                }
            });
            await transporter.sendMail({
                from: `"No Reply" <${emailTransporter.auth.user}>`,
                to,
                subject,
                html: `<b>${message}</b>`
            });
        }
        else {
            throw new Error("Unsupported email transporter");
        }
    }
    // Send WhatsApp Notification
    async sendWhatsApp(number, message) {
        if (!this.integrationSetting || !this.integrationSetting.data?.whatsapp) {
            throw new Error("WhatsApp integration settings not configured");
        }
        const whatsappConfig = this.integrationSetting.data.whatsapp;
        const url = `${whatsappConfig.url}?api_key=${whatsappConfig.appKey}&sender=${number}&number=${number}&message=${message}`;
        try {
            const response = await axios_1.default.get(url);
            console.log(`WhatsApp message sent: ${response.data}`);
        }
        catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw new Error("Failed to send WhatsApp message");
        }
    }
}
exports.NotificationService = NotificationService;
// Example usage:
// Get the notification service instance
(async () => {
    await NotificationService.getInstance();
})();
// // Send email
// notificationService.sendEmail('to@example.com', 'Subject', 'Email message content');
// // Send WhatsApp message
// notificationService.sendWhatsApp('62888xxxx', 'Hello World');
// // To refresh settings manually
// await notificationService.refreshSettings();
