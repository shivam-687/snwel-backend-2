import z from 'zod'
import dotenv from 'dotenv';
dotenv.config();

const CommonConfigSchema = z.object({
    DATABASE_URL: z.string(),
    PORT: z.number(),
    JWT_SECRET: z.string(),
    DATA_LIMIT: z.number()
})

export type CommonConfigType = z.infer<typeof CommonConfigSchema>;

export const CommonConfig: CommonConfigType = {
    DATABASE_URL: process.env.DATABASE_URL || '',
    PORT: process.env.PORT ? Number(process.env.PORT) : 9876,
    JWT_SECRET: process.env.JWT_SECRET || 'SNWELACADEMY',
    DATA_LIMIT: 10
}


try {
     CommonConfigSchema.parseAsync(CommonConfig);
    console.log("Configs validated");
} catch (error) {
    console.error("Config validation error", error);
    process.exit(1)
}
