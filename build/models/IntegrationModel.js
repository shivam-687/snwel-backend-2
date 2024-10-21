"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../config/common");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
mongoose_paginate_v2_1.default.paginate.options = common_1.paginateOptions;
// Define the Mongoose schema
const IntegrationSchema = new mongoose_1.Schema({
    serviceName: { type: String, required: true },
    config: { type: mongoose_1.Schema.Types.Mixed, required: true }, // API keys, credentials, etc.
    enabled: { type: Boolean, default: true },
    supportedActions: { type: [String], required: true }, // e.g., ['otp', 'promotionalEmail']
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
IntegrationSchema.plugin(mongoose_paginate_v2_1.default);
// Create the model
const IntegrationModel = (0, mongoose_1.model)('Integration', IntegrationSchema);
exports.default = IntegrationModel;
