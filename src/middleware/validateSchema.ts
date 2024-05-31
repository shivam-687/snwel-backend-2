import { EmailSettingTypeSchema, GeneralSettingSchema, IntegrationSettingTypeSchema, SETTINGS, SettingSchema } from "@/entity-schema/setting-schema";
import { NextFunction, Response, Request } from "express";
import { ZodError, ZodSchema } from "zod";

export function validateSchema(schema: ZodSchema<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate request body against the schema
            schema.parse(req.body);
            // If validation passes, move to the next middleware
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // If validation fails, send a 400 Bad Request response with error details
                res.status(400).json({ error: 'Validation failed', details: error.errors });
            } else {
                // For any other errors, pass them along to the error handling middleware
                next(error);
            }
        }
    };
}


export function validateSettingSchema (type: SETTINGS) {
    const schema = {
        [SETTINGS.EMAIL]: EmailSettingTypeSchema,
        [SETTINGS.GENERAL]: GeneralSettingSchema,
        [SETTINGS.INTEGRATION]: IntegrationSettingTypeSchema
    };
    return validateSchema(schema[type]);
}