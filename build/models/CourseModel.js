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
exports.CourseModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const CourseSchema = new mongoose_1.Schema({
    id: String,
    image: String,
    title: String,
    slug: { type: String, unique: true },
    shortDescription: String,
    text: String,
    courseDuration: String,
    categories: [{ type: mongoose_1.Types.ObjectId, ref: 'CourseCategory' }],
    instructors: [{ type: mongoose_1.Types.ObjectId, ref: 'User' }],
    difficulty: String,
    language: [String],
    assessment: String,
    certificate: Boolean,
    lessons: Number,
    rating: { type: Number, default: 0 },
    enrolled: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    discount: Number,
    isPremium: { type: Boolean, default: false },
    masterCategory: String,
    appearence: {
        themeColor: String,
        forgroundColor: String,
    },
    images: {
        promotionalCardImage: String,
        iconImage: String,
    },
    curriculum: [{ title: String, duration: String, unit: String, classCount: Number, curriculumType: String }],
}, { timestamps: true });
CourseSchema.pre('save', async function (next) {
    try {
        const slug = (0, slugify_1.default)(this.title, { lower: true });
        const existingCourse = await exports.CourseModel.findOne({ slug });
        if (existingCourse) {
            let counter = 1;
            while (true) {
                const newSlug = `${slug}-${counter}`;
                const categoryWithSlug = await exports.CourseModel.findOne({ slug: newSlug });
                if (!categoryWithSlug) {
                    this.slug = newSlug;
                    break;
                }
                counter++;
            }
        }
        else {
            this.slug = slug;
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.CourseModel = mongoose_1.default.model('Course', CourseSchema);
