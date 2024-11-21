"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSettingSchema = exports.validateSchema = void 0;
const setting_schema_1 = require("../entity-schema/setting-schema");
const zod_1 = require("zod");
function validateSchema(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({ error: 'Validation failed', details: error.errors });
            }
            else {
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
