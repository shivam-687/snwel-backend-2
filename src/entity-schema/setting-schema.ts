import { z } from "zod";

export enum SETTINGS {
    INTEGRATION = 'INTEGRATION',
    GENERAL = 'GENERAL',
    EMAIL = 'EMAIL'
}

const settings_array = [
    'INTEGRATION',
    'GENERAL',
    'EMAIL'
] as const;

export const SettingSchema = z.object({
    code: z.enum(settings_array),
    data: z.any(),
    isChangable: z.boolean().optional().default(false)
})

export type Setting = z.infer<typeof SettingSchema>

export type CreateSettingInput<T=any> = {
    code: SETTINGS,
    data: T,
    isChangable: boolean
}
export type UpdateSettingInput<T=any> = {
    data: T,
    isChangable: boolean
}

export type GeneralSettingType = {
    email?: string,
    loc?: {
        city: string,
        country: string,
        zipcode: string,
        address: string
    },
    logoUrl?: string,
    phone?: string,
}


export enum EMAIL_TRANSPORTER {
    SENDGRID = 'SENDGRID',
    NODEMAILER = 'NODEMAILER',
    RESEND = 'RESEND'
}


export const IntegrationSettingTypeSchema = SettingSchema.merge(z.object({
    code: z.enum([SETTINGS.INTEGRATION]),
    data: z.object({
        whatsapp: z.object({
            url: z.string(),
            appKey: z.string(),
            authKey: z.string(),
            message: z.string().optional()
        }).optional(),
    })
}));


export type IntegrationSetting = z.infer<typeof IntegrationSettingTypeSchema>;

export const EmailSettingTypeSchema = SettingSchema.merge(z.object({
    code: z.enum([SETTINGS.EMAIL]),
    data: z.object({
        [EMAIL_TRANSPORTER.NODEMAILER]: z.object({
            host: z.string(),
            port: z.string(),
            secure: z.boolean(),
            auth: z.object({
                user: z.string(),
                pass: z.string()
            })
        }).optional(),

        [EMAIL_TRANSPORTER.RESEND]: z.object({
            token: z.string()
        }).optional()
    })
}));

export type EmailSetting = z.infer<typeof EmailSettingTypeSchema>;


export const GeneralSettingSchema = SettingSchema.merge(z.object({
    code: z.enum([SETTINGS.GENERAL]),
    data: z.object({
        siteName: z.string(),
        logoUrl: z.string().optional(),
        location: z.object({
            address: z.string(),
            city: z.string(),
            state: z.string(),
            country: z.string()
        }).optional(),
        contacts: z.object({
            phone: z.string().optional(),
            email: z.string().optional(),
        }).optional(),
        emailTransport: z.enum([EMAIL_TRANSPORTER.NODEMAILER, EMAIL_TRANSPORTER.RESEND, EMAIL_TRANSPORTER.SENDGRID]).default(EMAIL_TRANSPORTER.NODEMAILER).optional(),
        senderEmail: z.string()
    })
}))

export type GeneralSetting = z.infer<typeof GeneralSettingSchema>;




