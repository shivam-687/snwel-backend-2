import { Constants } from "@/config/constants";
import { EMAIL_TRANSPORTER, SETTINGS } from "@/entity-schema/setting-schema";
import { SettingModel } from "@/models/Setting";
import { render } from "@react-email/render";
import nodemailer, { Transporter } from "nodemailer";
import { Resend } from "resend";
import {OtpEmail} from '@/email-templates/otpEmail'


interface EmailServiceConfig {
    NODEMAILER?: {
        host: string;
        port: string;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    };
    RESEND?: {
        token: string;
    };
}

type MailOptions = {to: string, subject: string, html: string};

class EmailService {
    private transporter: any = null;
    private settings: EmailServiceConfig | null = null;
    private defaultService: EMAIL_TRANSPORTER.NODEMAILER | EMAIL_TRANSPORTER.RESEND | EMAIL_TRANSPORTER.SENDGRID = EMAIL_TRANSPORTER.RESEND;

    private async initialize() {
        const setting = await SettingModel.findOne({ code: SETTINGS.EMAIL });
        if (!setting || !setting.data) {
            throw new Error('Email settings not found or misconfigured');
        }

        this.settings = setting.data;

        if (this.settings?.NODEMAILER && this.defaultService === EMAIL_TRANSPORTER.NODEMAILER) {
            const nodemailerConfig = this.settings.NODEMAILER;

            this.transporter = nodemailer.createTransport({
                host: nodemailerConfig.host,
                port: parseInt(nodemailerConfig.port, 10),
                secure: nodemailerConfig.secure,
                auth: {
                    user: nodemailerConfig.auth.user,
                    pass: nodemailerConfig.auth.pass,
                },
            });
        } else if (this.settings?.RESEND && this.defaultService === EMAIL_TRANSPORTER.RESEND) {
            const resendConfig = this.settings.RESEND;
            
            const resend = new Resend(resendConfig.token);
            this.transporter = {
                sendMail: async (mailOptions: MailOptions) => {
                    return await resend.emails.send({
                        from: Constants.FROM_EMAIL,
                        to: mailOptions.to,
                        subject: mailOptions.subject,
                        html: mailOptions.html
                    })
                },
            } as unknown as Transporter;
        } else {
            throw new Error('No valid email transporter configuration found');
        }
    }

    public async sendEmail(to: string, subject: string, html: string): Promise<any> {
        if (!this.transporter) {
            await this.initialize();
        }
        const mailOptions = {
            from: Constants.FROM_EMAIL,
            to,
            subject,
            html,
        };

        const info = await this.transporter.sendMail(mailOptions);
        return info;
    }

    public async sendOtp(email: string, otp: string): Promise<any> {
        

        const subject = 'Your OTP Code';
        return this.sendEmail(email, subject, render(OtpEmail({otp})));
    }
}

export default new EmailService();


