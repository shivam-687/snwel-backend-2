"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const setting_schema_1 = require("../entity-schema/setting-schema");
const Setting_1 = require("../models/Setting");
const nodemailer_1 = __importDefault(require("nodemailer"));
const resend_1 = require("resend");
class EmailService {
    constructor() {
        this.transporter = null;
        this.settings = null;
        this.defaultService = setting_schema_1.EMAIL_TRANSPORTER.RESEND;
    }
    async initialize() {
        const setting = await Setting_1.SettingModel.findOne({ code: setting_schema_1.SETTINGS.EMAIL });
        if (!setting || !setting.data) {
            throw new Error('Email settings not found or misconfigured');
        }
        this.settings = setting.data;
        if (this.settings?.NODEMAILER && this.defaultService === setting_schema_1.EMAIL_TRANSPORTER.NODEMAILER) {
            const nodemailerConfig = this.settings.NODEMAILER;
            this.transporter = nodemailer_1.default.createTransport({
                host: nodemailerConfig.host,
                port: parseInt(nodemailerConfig.port, 10),
                secure: nodemailerConfig.secure,
                auth: {
                    user: nodemailerConfig.auth.user,
                    pass: nodemailerConfig.auth.pass,
                },
            });
        }
        else if (this.settings?.RESEND && this.defaultService === setting_schema_1.EMAIL_TRANSPORTER.RESEND) {
            const resendConfig = this.settings.RESEND;
            const resend = new resend_1.Resend(resendConfig.token);
            this.transporter = {
                sendMail: async (mailOptions) => {
                    return await resend.emails.send({
                        from: constants_1.Constants.FROM_EMAIL,
                        to: mailOptions.to,
                        subject: mailOptions.subject,
                        html: mailOptions.html
                    });
                },
            };
        }
        else {
            throw new Error('No valid email transporter configuration found');
        }
    }
    async sendEmail(to, subject, html) {
        if (!this.transporter) {
            await this.initialize();
        }
        const mailOptions = {
            from: constants_1.Constants.FROM_EMAIL,
            to,
            subject,
            html,
        };
        const info = await this.transporter.sendMail(mailOptions);
        return info;
    }
    async sendOtp(email, otp) {
        const subject = 'Your OTP Code';
        return this.sendEmail(email, subject, "");
    }
}
exports.default = new EmailService();
