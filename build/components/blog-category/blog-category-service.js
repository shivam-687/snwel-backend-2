"use strict";
// src/services/adminBlogCategoryService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hardDeleteSoftDeletedBlogCategories = exports.adminExportBlogCategories = exports.adminGetAllBlogCategories = exports.adminDeleteBlogCategoryById = exports.softDeleteBlogCategoryById = exports.adminUpdateBlogCategoryById = exports.adminGetBlogCategoryById = exports.adminCreateBlogCategory = void 0;
const blog_category_model_1 = __importDefault(require("./blog-category-model"));
const helpers_1 = require("../../utils/helpers");
const mongoose_1 = require("mongoose");
const json2csv_1 = require("json2csv");
// Function to create a new blog category
async function adminCreateBlogCategory(data) {
    try {
        const category = await blog_category_model_1.default.create(data);
        return category.toObject();
    }
    catch (error) {
        console.error(`Failed to create blog category: ${error.message}`, error);
        throw new Error(`Failed to create blog category: ${error.message}`);
    }
}
exports.adminCreateBlogCategory = adminCreateBlogCategory;
// Function to get a blog category by ID or slug
async function adminGetBlogCategoryById(categoryId) {
    try {
        const query = mongoose_1.Types.ObjectId.isValid(categoryId)
            ? { _id: categoryId }
            : { slug: categoryId };
        const category = await blog_category_model_1.default.findOne(query);
        return category ? category.toObject() : null;
    }
    catch (error) {
        throw new Error(`Failed to get blog category: ${error.message}`);
    }
}
exports.adminGetBlogCategoryById = adminGetBlogCategoryById;
// Function to update a blog category by ID
async function adminUpdateBlogCategoryById(categoryId, updateData) {
    try {
        const category = await blog_category_model_1.default.findByIdAndUpdate(categoryId, updateData, { new: true });
        return category ? category.toObject() : null;
    }
    catch (error) {
        throw new Error(`Failed to update blog category: ${error.message}`);
    }
}
exports.adminUpdateBlogCategoryById = adminUpdateBlogCategoryById;
// Function to soft delete a blog category by ID
async function softDeleteBlogCategoryById(categoryId) {
    try {
        await blog_category_model_1.default.delete({ _id: categoryId });
        console.log(`Soft deleted blog category with ID: ${categoryId}`);
    }
    catch (error) {
        throw new Error(`Failed to soft delete blog category: ${error.message}`);
    }
}
exports.softDeleteBlogCategoryById = softDeleteBlogCategoryById;
// Function to delete a blog category by ID
async function adminDeleteBlogCategoryById(categoryId) {
    try {
        await blog_category_model_1.default.delete({ _id: categoryId });
    }
    catch (error) {
        throw new Error(`Failed to delete blog category: ${error.message}`);
    }
}
exports.adminDeleteBlogCategoryById = adminDeleteBlogCategoryById;
// Function to get all blog categories with pagination
const adminGetAllBlogCategories = async (options) => {
    try {
        const { limit = 10, page = 1, search, sort } = options;
        const query = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ name: searchRegex }, { description: searchRegex }];
        }
        const categories = await blog_category_model_1.default.paginate(query, {
            page,
            limit,
            sort: sort ? (0, helpers_1.convertSortOrder)(sort) : { createdAt: -1 },
        });
        return categories;
    }
    catch (error) {
        throw new Error(`Error retrieving blog categories: ${error.message}`);
    }
};
exports.adminGetAllBlogCategories = adminGetAllBlogCategories;
// Function to export blog categories to CSV
const adminExportBlogCategories = async (options) => {
    try {
        const categories = await (0, exports.adminGetAllBlogCategories)(options);
        const categoryData = categories.docs; // Extract the documents from the paginated result
        // Convert the data to CSV format
        const parser = new json2csv_1.Parser();
        const csv = parser.parse(categoryData);
        return csv; // You can return the CSV string or save it to a file
    }
    catch (error) {
        throw new Error(`Error exporting blog categories: ${error.message}`);
    }
};
exports.adminExportBlogCategories = adminExportBlogCategories;
// Function to hard delete all soft-deleted blog categories
const hardDeleteSoftDeletedBlogCategories = async () => {
    try {
        // Find and remove all soft-deleted blog categories
        await blog_category_model_1.default.deleteMany({ deleted: true });
        console.log("Successfully hard deleted all soft-deleted blog categories");
    }
    catch (error) {
        throw new Error(`Failed to hard delete soft-deleted blog categories: ${error.message}`);
    }
};
exports.hardDeleteSoftDeletedBlogCategories = hardDeleteSoftDeletedBlogCategories;
