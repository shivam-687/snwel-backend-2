"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Enquiry.ts
const mongoose_1 = __importStar(require("mongoose"));
const common_1 = require("../config/common");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
mongoose_paginate_v2_1.default.paginate.options = common_1.paginateOptions;
const EnquirySchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    type: { type: String, enum: ['general', 'job', 'support', 'webinar', 'contact'], required: true },
    extraInfo: { type: mongoose_1.Schema.Types.Mixed },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
}, { timestamps: true });
EnquirySchema.plugin(mongoose_paginate_v2_1.default);
exports.default = mongoose_1.default.model('Enquiry', EnquirySchema);
