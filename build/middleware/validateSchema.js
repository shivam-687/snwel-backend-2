"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSettingSchema = exports.validateSchema = void 0;
const setting_schema_1 = require("../entity-schema/setting-schema");
const zod_1 = require("zod");
function validateSchema(schema) {
    return (req, res, next) => {
        try {
            // Validate request body against the schema
            schema.parse(req.body);
            // If validation passes, move to the next middleware
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // If validation fails, send a 400 Bad Request response with error details
                res.status(400).json({ error: 'Validation failed', details: error.errors });
            }
            else {
                // For any other errors, pass them along to the error handling middleware
                next(error);
            }
        }
    };
}
exports.validateSchema = validateSchema;
function validateSettingSchema(type) {
    const schema = {
        [setting_schema_1.SETTINGS.EMAIL]: setting_schema_1.EmailSettingTypeSchema,
        [setting_schema_1.SETTINGS.GENERAL]: setting_schema_1.GeneralSettingSchema,
        [setting_schema_1.SETTINGS.INTEGRATION]: setting_schema_1.IntegrationSettingTypeSchema,
        [setting_schema_1.SETTINGS.MENUBUILDER]: setting_schema_1.MenuSettingSchema
    };
    return validateSchema(schema[type]);
}
exports.validateSettingSchema = validateSettingSchema;
