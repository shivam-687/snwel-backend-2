import { z } from "zod";

export const WhatsappConfig = z.object({
    url: z.string(),
    apiKey: z.string(),
    phoneNumber: z.string()
})