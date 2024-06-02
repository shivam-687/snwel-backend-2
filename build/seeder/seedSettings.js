"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setting_schema_1 = require("../entity-schema/setting-schema");
const Setting_1 = require("../models/Setting");
const seedSettings = async () => {
    try {
        const settings = [
            {
                code: setting_schema_1.SETTINGS.GENERAL,
                data: {
                    siteName: "My Awesome Site",
                    logoUrl: "https://example.com/logo.png",
                    location: {
                        address: "123 Main St",
                        city: "Anytown",
                        state: "Anystate",
                        country: "Anyland"
                    },
                    contacts: {
                        phone: "+1234567890",
                        email: "contact@example.com"
                    }
                },
                isChangable: true
            },
            {
                code: setting_schema_1.SETTINGS.INTEGRATION,
                data: {
                    whatsapp: {
                        appKey: "whatsapp-app-key",
                        authKey: "whatsapp-auth-key",
                        message: "Welcome to our service"
                    }
                },
                isChangable: true
            },
            {
                code: setting_schema_1.SETTINGS.EMAIL,
                data: {
                    [setting_schema_1.EMAIL_TRANSPORTER.RESEND]: {
                        token: "re_UhUC3YLC_EMhuRzCerGkWAw48edEZfVkt"
                    }
                },
                isChangable: true
            }
        ];
        await Setting_1.SettingModel.insertMany(settings);
        console.log('Seed data inserted successfully');
    }
    catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};
seedSettings();
