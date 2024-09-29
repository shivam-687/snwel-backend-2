import { courseEnquiryTemplate, jobApplyConfirmTemplate, otpEmailTemplate } from "@/email-templates/templateFactory";
import { SMTPSchema } from "@/entity-schema/email-apps-schema";
import { EMAIL_TRANSPORTER, EmailSetting, GeneralSettingData, IntegrationSetting, SETTINGS } from "@/entity-schema/setting-schema";
import { WhatsappConfig } from "@/entity-schema/whatsapp-schema";
import { Course } from "@/models/CourseModel";
import IntegrationModel, { IIntegration } from "@/models/IntegrationModel";
import { IJobApplication } from "@/models/JobApplicationModel";
import { SettingModel } from "@/models/Setting";
import axios from "axios";
import nodemailer from 'nodemailer'

enum AppIds {
    WHATSAPP = "whatsapp",
    SMTP = "smtp",
    RENDER_EMAIL = "render",
    TELEGRAM = "telegram",
    SMS = "sms",
    PUSH = "push"
}

export class NotificationService {
    private static instance: NotificationService;
    private emailSetting: EmailSetting | undefined;
    private integrationSetting: IntegrationSetting | undefined;
    private generalSetting: GeneralSettingData | undefined;
    private ingerations: IIntegration[] = [];

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
        await this.loadIntegrations();
        this.emailSetting = await this.loadEmailSettingsFromDB();
        this.integrationSetting = await this.loadIntegrationSettingsFromDB();
        this.generalSetting = await this.loadGeneralSettingsFromDB()
    }

    // Load email settings from DB (replace this with actual DB call)
    private async loadEmailSettingsFromDB(): Promise<EmailSetting | undefined> {
        const emailSetting = await SettingModel.findOne({ code: SETTINGS.EMAIL });
        return emailSetting as EmailSetting;
    }

    // Load integration (WhatsApp) settings from DB (replace this with actual DB call)
    private async loadIntegrationSettingsFromDB(): Promise<IntegrationSetting | undefined> {
        const emailSetting = await SettingModel.findOne({ code: SETTINGS.INTEGRATION });
        return emailSetting as IntegrationSetting;
    }
    private async loadGeneralSettingsFromDB(): Promise<GeneralSettingData | undefined> {
        const emailSetting = await SettingModel.findOne({ code: SETTINGS.GENERAL });
        return emailSetting?.data as GeneralSettingData;
    }

    private async loadIntegrations() {
        const res = await IntegrationModel.find({}).lean();
        this.ingerations = res;
        console.log("Integration: ", this.ingerations)
    }

    // Refresh settings manually
    public async refreshSettings(): Promise<void> {
        await this.loadSettings();
        console.log('Settings refreshed');
    }

    // Send Email Notification
    async sendEmail(to: string, subject: string, message: string): Promise<void> {
        try {
            const smtp = this.ingerations.find(it => it.serviceName === AppIds.SMTP);
            if(!smtp || !smtp.enabled) return;
            const smtpConfig = SMTPSchema.parse(smtp?.config);
            console.log("Start sending mail to", to)
            const transporter = nodemailer.createTransport({
                host: smtpConfig.host,
                port: parseInt(smtpConfig.port),
                secure: false,
                auth: {
                    user: smtpConfig.auth.username,
                    pass: smtpConfig.auth.password
                },
                tls: {
                    rejectUnauthorized: false, // Add this only for testing environments; avoid using it in production
                }
            });

            await transporter.sendMail({
                from: this.generalSetting?.senderEmail || `"No Reply" <${smtpConfig.auth.username}>`,
                to,
                subject,
                html: `<b>${message}</b>`
            });
        } catch (error) {
            console.error("sendEmail",error);
            throw error;
        }
    }

    async sendWhatsApp(number: string, message: string): Promise<void> {
        const whatsapp = this.ingerations.find(it => it.serviceName === AppIds.WHATSAPP);
        if(!whatsapp || !whatsapp.enabled) return console.log("Whatsapp otp is not enabled");
        const whatsappConfig = WhatsappConfig.safeParse(whatsapp?.config);
        if(!whatsappConfig.success){
            throw new Error("WhatsApp integration settings not configured");
        }
       
        const url = `${whatsappConfig.data.url}?api_key=${whatsappConfig.data.apiKey}&sender=${whatsappConfig.data.phoneNumber}&number=${number}&message=${message}`;
        try {
            const response = await axios.get(url);
            console.log(`WhatsApp message sent: ${response.data}`);
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw new Error("Failed to send WhatsApp message");
        }
    }
}


(async () => {
    await NotificationService.getInstance();
})();



export const sendOTPNotification = async (otp: string, to: string) => {
    const template = await otpEmailTemplate(otp);
    const ns = await NotificationService.getInstance();
    await ns.sendEmail(
        to,
        template.subject,
        template.template
    )
}
export const sendOTPWhatsapp = async (otp: string, number: string) => {
    const ns = await NotificationService.getInstance();
    await ns.sendWhatsApp(
        number,
        `Your OTP is ${otp}`
    )
}


export const sendCourseEnquiryNotification = async (course: Course, to: {email?: string, phone?: string, userName?: string}) => {
    const ns = await NotificationService.getInstance();
    if(to.email){
        const template = await courseEnquiryTemplate(course, to.userName||"");
        await ns.sendEmail(
            to.email,
            template.subject,
            template.template
        )
    }
}
export const sendJobApplyConfirmation = async (jobApp: IJobApplication, to: {email?: string, phone?: string}) => {
    const ns = await NotificationService.getInstance();
    if(to.email){
        const template = await jobApplyConfirmTemplate(jobApp);
        await ns.sendEmail(
            to.email,
            template.subject,
            template.template
        )
    }
}
