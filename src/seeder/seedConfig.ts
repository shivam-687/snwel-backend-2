// config/seedConfig.ts

import { EMAIL_TRANSPORTER, SETTINGS } from "../entity-schema/setting-schema";


export const emailSetting = {
    code: SETTINGS.EMAIL,
    data: {
        [EMAIL_TRANSPORTER.NODEMAILER]: {
            host: 'smtp.example.com',
            port: '587',
            secure: false,
            auth: {
                user: 'user@example.com',
                pass: 'password',
            },
        },
        [EMAIL_TRANSPORTER.RESEND]: {
            token: 're_123456789',
        },
    },
    isChangable: true,
};

export const generalSetting = {
    code: SETTINGS.GENERAL,
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
        emailTransport: EMAIL_TRANSPORTER.NODEMAILER,
        senderEmail: 'noreply@mysite.com',
    },
    isChangable: true,
};

export const integrationSetting = {
    code: SETTINGS.INTEGRATION,
    data: {
        whatsapp: {
            appKey: 'your-whatsapp-app-key',
            authKey: 'your-whatsapp-auth-key',
        },
    },
    isChangable: true,
};

// Export an array of all settings for easier iteration
export const allSettings = [emailSetting, generalSetting, integrationSetting];
