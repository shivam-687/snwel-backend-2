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
exports.CourseEnrollmentModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const common_1 = require("../../../config/common");
mongoose_paginate_v2_1.default.paginate.options = common_1.paginateOptions;
const CourseEnrollmentSchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    enrollmentDate: { type: Date, default: Date.now },
    completionDate: { type: Date },
    progress: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentAmount: { type: Number, required: true },
    paymentId: { type: String },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    review: { type: String }
}, {
    timestamps: true
});
CourseEnrollmentSchema.index({ course: 1, user: 1 }, { unique: true });
CourseEnrollmentSchema.index({ user: 1 });
CourseEnrollmentSchema.index({ course: 1 });
CourseEnrollmentSchema.index({ status: 1 });
CourseEnrollmentSchema.index({ paymentStatus: 1 });
CourseEnrollmentSchema.plugin(mongoose_paginate_v2_1.default);
exports.CourseEnrollmentModel = mongoose_1.default.model('CourseEnrollment', CourseEnrollmentSchema);
