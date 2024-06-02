"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralSettingSchema = exports.EmailSettingTypeSchema = exports.IntegrationSettingTypeSchema = exports.EMAIL_TRANSPORTER = exports.SettingSchema = exports.SETTINGS = void 0;
const zod_1 = require("zod");
var SETTINGS;
(function (SETTINGS) {
    SETTINGS["INTEGRATION"] = "INTEGRATION";
    SETTINGS["GENERAL"] = "GENERAL";
    SETTINGS["EMAIL"] = "EMAIL";
})(SETTINGS || (exports.SETTINGS = SETTINGS = {}));
const settings_array = [
    'INTEGRATION',
    'GENERAL',
    'EMAIL'
];
exports.SettingSchema = zod_1.z.object({
    code: zod_1.z.enum(settings_array),
    data: zod_1.z.any(),
    isChangable: zod_1.z.boolean().optional().default(false)
});
var EMAIL_TRANSPORTER;
(function (EMAIL_TRANSPORTER) {
    EMAIL_TRANSPORTER["SENDGRID"] = "SENDGRID";
    EMAIL_TRANSPORTER["NODEMAILER"] = "NODEMAILER";
    EMAIL_TRANSPORTER["RESEND"] = "RESEND";
})(EMAIL_TRANSPORTER || (exports.EMAIL_TRANSPORTER = EMAIL_TRANSPORTER = {}));
exports.IntegrationSettingTypeSchema = exports.SettingSchema.merge(zod_1.z.object({
    code: zod_1.z.enum([SETTINGS.INTEGRATION]),
    data: zod_1.z.object({
        whatsapp: zod_1.z.object({
            url: zod_1.z.string(),
            appKey: zod_1.z.string(),
            authKey: zod_1.z.string(),
            message: zod_1.z.string().optional()
        }).optional(),
    })
}));
exports.EmailSettingTypeSchema = exports.SettingSchema.merge(zod_1.z.object({
    code: zod_1.z.enum([SETTINGS.EMAIL]),
    data: zod_1.z.object({
        [EMAIL_TRANSPORTER.NODEMAILER]: zod_1.z.object({
            host: zod_1.z.string(),
            port: zod_1.z.string(),
            secure: zod_1.z.boolean(),
            auth: zod_1.z.object({
                user: zod_1.z.string(),
                pass: zod_1.z.string()
            })
        }).optional(),
        [EMAIL_TRANSPORTER.RESEND]: zod_1.z.object({
            token: zod_1.z.string()
        }).optional()
    })
}));
exports.GeneralSettingSchema = exports.SettingSchema.merge(zod_1.z.object({
    code: zod_1.z.enum([SETTINGS.GENERAL]),
    data: zod_1.z.object({
        siteName: zod_1.z.string(),
        logoUrl: zod_1.z.string().optional(),
        location: zod_1.z.object({
            address: zod_1.z.string(),
            city: zod_1.z.string(),
            state: zod_1.z.string(),
            country: zod_1.z.string()
        }).optional(),
        contacts: zod_1.z.object({
            phone: zod_1.z.string().optional(),
            email: zod_1.z.string().optional(),
        }).optional(),
        emailTransport: zod_1.z.enum([EMAIL_TRANSPORTER.NODEMAILER, EMAIL_TRANSPORTER.RESEND, EMAIL_TRANSPORTER.SENDGRID]).default(EMAIL_TRANSPORTER.NODEMAILER).optional(),
        senderEmail: zod_1.z.string()
    })
}));
