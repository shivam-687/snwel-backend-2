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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebinarModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const soft_delete_plugin_mongoose_1 = require("soft-delete-plugin-mongoose");
const WebinarSchema = new mongoose_1.Schema({
    id: String,
    title: String,
    shortDescription: String,
    content: String,
    startDate: String,
    slug: String,
    thumbnail: String,
    coverImage: { type: String },
    isActive: { type: Boolean, default: true },
    hosts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: [] }],
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    curriculum: [{ title: String, duration: String }],
}, { timestamps: true });
WebinarSchema.plugin(soft_delete_plugin_mongoose_1.softDeletePlugin);
exports.WebinarModel = mongoose_1.default.model('Webinar', WebinarSchema);