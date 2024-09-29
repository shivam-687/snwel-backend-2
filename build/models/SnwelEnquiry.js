"use strict";
// src/models/Enquiry.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../config/common");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
mongoose_paginate_v2_1.default.paginate.options = common_1.paginateOptions;
const enquirySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    businessEmail: { type: String, required: true },
    company: { type: String, required: true },
    enquiryType: {
        type: String,
        enum: ['General Enquiry', 'Analysis Services', '3D Modelling', '3D Laser Scanning', 'Piping Engineering', 'Structural Engineering', 'Instrumentation Engineering', '3D Printing', 'Fire Fighting Engineering'],
        required: true
    },
    mobileNo: { type: String, required: true },
    description: { type: String, required: true, maxlength: 200 },
    consentGiven: { type: Boolean, required: true, default: false },
    otpValidated: { type: Boolean, required: true, default: false },
}, { timestamps: true });
enquirySchema.plugin(mongoose_paginate_v2_1.default);
const SnwelEnquiry = (0, mongoose_1.model)('SnwelEnquiry', enquirySchema);
exports.default = SnwelEnquiry;
