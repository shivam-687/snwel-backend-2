"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Mongoose schema
const IntegrationSchema = new mongoose_1.Schema({
    serviceName: { type: String, required: true },
    config: { type: mongoose_1.Schema.Types.Mixed, required: true }, // API keys, credentials, etc.
    enabled: { type: Boolean, default: true },
    supportedActions: { type: [String], required: true }, // e.g., ['otp', 'promotionalEmail']
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// Create the model
const IntegrationModel = (0, mongoose_1.model)('Integration', IntegrationSchema);
exports.default = IntegrationModel;
