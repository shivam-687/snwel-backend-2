"use strict";
// config/seedConfig.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.allSettings = exports.integrationSetting = exports.generalSetting = exports.emailSetting = void 0;
const setting_schema_1 = require("../entity-schema/setting-schema");
exports.emailSetting = {
    code: setting_schema_1.SETTINGS.EMAIL,
    data: {
        [setting_schema_1.EMAIL_TRANSPORTER.NODEMAILER]: {
            host: 'smtp.example.com',
            port: '587',
            secure: false,
            auth: {
                user: 'user@example.com',
                pass: 'password',
            },
        },
        [setting_schema_1.EMAIL_TRANSPORTER.RESEND]: {
            token: 're_123456789',
        },
    },
    isChangable: true,
};
exports.generalSetting = {
    code: setting_schema_1.SETTINGS.GENERAL,
    data: {
        siteName: 'My Site',
        location: {
            address: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            country: 'USA',
        },
        contacts: {
            phone: '123-456-7890',
            email: 'info@mysite.com',
        },
        emailTransport: setting_schema_1.EMAIL_TRANSPORTER.NODEMAILER,
        senderEmail: 'noreply@mysite.com',
    },
    isChangable: true,
};
exports.integrationSetting = {
    code: setting_schema_1.SETTINGS.INTEGRATION,
    data: {
        whatsapp: {
            appKey: 'your-whatsapp-app-key',
            authKey: 'your-whatsapp-auth-key',
        },
    },
    isChangable: true,
};
// Export an array of all settings for easier iteration
exports.allSettings = [exports.emailSetting, exports.generalSetting, exports.integrationSetting];
