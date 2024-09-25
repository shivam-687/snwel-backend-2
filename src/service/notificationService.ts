import { EMAIL_TRANSPORTER, EmailSetting, IntegrationSetting, SETTINGS } from "@/entity-schema/setting-schema";
import { SettingModel } from "@/models/Setting";
import axios from "axios";
import nodemailer from 'nodemailer'

export class NotificationService {
    private static instance: NotificationService;
    private emailSetting: EmailSetting | undefined;
    private integrationSetting: IntegrationSetting | undefined;

    // Private constructor to prevent direct instantiation
    private constructor() { }

    // Get the singleton instance
    public static async getInstance(): Promise<NotificationService> {
        if (!NotificationService.instance) {
            const instance = new NotificationService();
            await instance.loadSettings();  // Load settings when instance is first created
            NotificationService.instance = instance;
            console.log("Load setting successfully")
        }
        return NotificationService.instance;
    }

    // Load settings from the database (this would typically call your database or config service)
    private async loadSettings(): Promise<void> {
        // Simulate loading settings from the database
        this.emailSetting = await this.loadEmailSettingsFromDB();
        this.integrationSetting = await this.loadIntegrationSettingsFromDB();
    }

    // Load email settings from DB (replace this with actual DB call)
    private async loadEmailSettingsFromDB(): Promise<EmailSetting | undefined> {
        const emailSetting = await SettingModel.findOne({ code: SETTINGS.EMAIL });
        return emailSetting as EmailSetting;
    }

    // Load integration (WhatsApp) settings from DB (replace this with actual DB call)
    private async loadIntegrationSettingsFromDB(): Promise<IntegrationSetting | undefined> {
        const emailSetting = await SettingModel.findOne({ code: SETTINGS.INTEGRATION});
        return emailSetting as IntegrationSetting;
    }

    // Refresh settings manually
    public async refreshSettings(): Promise<void> {
        await this.loadSettings();
        console.log('Settings refreshed');
    }

    // Send Email Notification
    async sendEmail(to: string, subject: string, message: string): Promise<void> {
        if (!this.emailSetting || !this.emailSetting.data) {
            throw new Error("Email settings not configured");
        }

        const emailTransporter = this.emailSetting.data[EMAIL_TRANSPORTER.NODEMAILER];
        if (!emailTransporter) {
            throw new Error("Email transporter is not configured");
        }

        if (this.emailSetting.data[EMAIL_TRANSPORTER.NODEMAILER]) {
            console.log("Start sending mail to", to)
            const transporter = nodemailer.createTransport({
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

        } else {
            throw new Error("Unsupported email transporter");
        }
    }

    // Send WhatsApp Notification
    async sendWhatsApp(number: string, message: string): Promise<void> {
        if (!this.integrationSetting || !this.integrationSetting.data?.whatsapp) {
            throw new Error("WhatsApp integration settings not configured");
        }

        const whatsappConfig = this.integrationSetting.data.whatsapp;
        const url = `${whatsappConfig.url}?api_key=${whatsappConfig.appKey}&sender=${number}&number=${number}&message=${message}`;

        try {
            const response = await axios.get(url);
            console.log(`WhatsApp message sent: ${response.data}`);
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw new Error("Failed to send WhatsApp message");
        }
    }
}

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
