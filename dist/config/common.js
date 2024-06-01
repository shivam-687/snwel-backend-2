"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonConfig = void 0;
const zod_1 = __importDefault(require("zod"));
const CommonConfigSchema = zod_1.default.object({
    DATABASE_URL: zod_1.default.string(),
    PORT: zod_1.default.number(),
    JWT_SECRET: zod_1.default.string()
});
exports.CommonConfig = {
    DATABASE_URL: process.env.DATABASE_URL || '',
    PORT: process.env.PORT ? Number(process.env.PORT) : 9876,
    JWT_SECRET: process.env.JWT_SECRET || 'SNWELACADEMY'
};
try {
    CommonConfigSchema.parseAsync(exports.CommonConfig);
    console.log("Configs validated");
}
catch (error) {
    console.error("Config validation error", error);
    process.exit(1);
}