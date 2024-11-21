"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../config/common");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
mongoose_paginate_v2_1.default.paginate.options = common_1.paginateOptions;
const blogCategorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
blogCategorySchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
blogCategorySchema.index({ slug: 1 });
blogCategorySchema.plugin(mongoose_paginate_v2_1.default);
blogCategorySchema.plugin(mongoose_delete_1.default, { deletedAt: true, overrideMethods: 'all' });
const BlogCategory = (0, mongoose_1.model)('BlogCategory', blogCategorySchema);
exports.default = BlogCategory;
