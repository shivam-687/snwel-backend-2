"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateOptions = exports.CommonConfig = void 0;
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CommonConfigSchema = zod_1.default.object({
    DATABASE_URL: zod_1.default.string(),
    PORT: zod_1.default.number(),
    JWT_SECRET: zod_1.default.string(),
    DATA_LIMIT: zod_1.default.number()
});
exports.CommonConfig = {
    DATABASE_URL: process.env.DATABASE_URL || '',
    PORT: process.env.PORT ? Number(process.env.PORT) : 9876,
    JWT_SECRET: process.env.JWT_SECRET || 'SNWELACADEMY',
    DATA_LIMIT: 10
};
try {
    CommonConfigSchema.parseAsync(exports.CommonConfig);
    console.log("Configs validated");
}
catch (error) {
    console.error("Config validation error", error);
    process.exit(1);
}
exports.paginateOptions = {
    customLabels: {
        totalDocs: 'total', // Rename totalDocs to totalItems
        docs: 'docs', // Rename docs to applications
        limit: 'pageSize', // Rename limit to pageSize
        totalPages: 'totalPages', // Keep the same or rename as needed
        page: 'currentPage', // Rename page to currentPage
        nextPage: 'nextPage', // Rename nextPage to next
        prevPage: 'prevPage', // Rename prevPage to previous
        hasPrevPage: 'hasPrevious', // Rename hasPrevPage to hasPrevious
        hasNextPage: 'hasNext', // Rename hasNextPage to hasNext
    }
};
