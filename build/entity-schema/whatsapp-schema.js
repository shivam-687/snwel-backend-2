"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappConfig = void 0;
const zod_1 = require("zod");
exports.WhatsappConfig = zod_1.z.object({
    url: zod_1.z.string(),
    apiKey: zod_1.z.string(),
    phoneNumber: zod_1.z.string()
});
