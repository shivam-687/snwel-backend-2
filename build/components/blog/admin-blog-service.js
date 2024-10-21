"use strict";
// src/services/adminBlogService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteBlogById = exports.hardDeleteSoftDeletedBlogs = exports.adminExportBlogs = exports.adminGetAllBlogs = exports.adminDeleteBlogById = exports.adminUpdateBlogById = exports.adminGetBlogById = exports.adminCreateBlog = void 0;
const blog_model_1 = __importDefault(require("./blog-model"));
const helpers_1 = require("../../utils/helpers");
const mongoose_1 = require("mongoose");
const json2csv_1 = require("json2csv");
// Function to create a new blog (Admins may have access to create published blogs directly)
async function adminCreateBlog(data) {
    try {
        // If the blog should be published immediately, set the `publishedAt`
        if (data.published && !data.publishedAt) {
            data.publishedAt = new Date();
        }
        const blog = await blog_model_1.default.create(data);
        return blog.toObject();
    }
    catch (error) {
        console.error(`Failed to create blog: ${error.message}`, error);
        throw new Error(`Failed to create blog: ${error.message}`);
    }
}
exports.adminCreateBlog = adminCreateBlog;
// Function to get a blog by ID (Admins can retrieve both published and unpublished blogs)
async function adminGetBlogById(blogId) {
    try {
        const query = mongoose_1.Types.ObjectId.isValid(blogId)
            ? { _id: blogId }
            : { slug: blogId };
        const blog = await blog_model_1.default.findOne(query).populate('author', '_id profilePic name email');
        return blog ? blog.toObject() : null;
    }
    catch (error) {
        throw new Error(`Failed to get blog: ${error.message}`);
    }
}
exports.adminGetBlogById = adminGetBlogById;
// Function to update a blog by ID (Admins can update everything, including publication status)
async function adminUpdateBlogById(blogId, updateData) {
    try {
        if (updateData.published && !updateData.publishedAt) {
            updateData.publishedAt = new Date();
        }
        const blog = await blog_model_1.default.findByIdAndUpdate(blogId, updateData, { new: true });
        return blog ? blog.toObject() : null;
    }
    catch (error) {
        throw new Error(`Failed to update blog: ${error.message}`);
    }
}
exports.adminUpdateBlogById = adminUpdateBlogById;
// Function to delete a blog by ID (Admins can delete blogs regardless of the published status)
async function adminDeleteBlogById(blogId) {
    try {
        await blog_model_1.default.delete({ _id: blogId });
    }
    catch (error) {
        throw new Error(`Failed to delete blog: ${error.message}`);
    }
}
exports.adminDeleteBlogById = adminDeleteBlogById;
// Function to get all blogs with pagination (Admins can view all blogs including unpublished)
// Function to get all blogs with pagination (Admins can view blogs based on predefined filter keywords)
const adminGetAllBlogs = async (options) => {
    try {
        const { limit = 10, page = 1, search, filter, sort, startDate, endDate } = options;
        const query = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ title: searchRegex }, { content: searchRegex }, { author: searchRegex }];
        }
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }
        // Apply filter based on the 'show' keyword
        switch (filter?.statusFilter) {
            case 'published':
                query.published = true;
                break;
            case 'unpublished':
                query.published = false;
                break;
            case 'all':
                query.published = { $in: [true, false] }; // Shows both published and unpublished blogs
                break;
            default:
                // No filter for 'undefined', returning only published blogs by default
                query.published = { $in: [true, false] };
                break;
        }
        const blogs = await blog_model_1.default.paginate(query, {
            populate: 'category',
            page,
            limit,
            sort: sort ? (0, helpers_1.convertSortOrder)(sort) : { createdAt: -1 },
        });
        return blogs;
    }
    catch (error) {
        throw new Error(`Error retrieving blogs: ${error.message}`);
    }
};
exports.adminGetAllBlogs = adminGetAllBlogs;
// Function to export blogs to CSV (Admins can export all blogs including unpublished)
const adminExportBlogs = async (options) => {
    try {
        const blogs = await (0, exports.adminGetAllBlogs)(options);
        const blogData = blogs.docs; // Extract the documents from the paginated result
        // Convert the data to CSV format
        const parser = new json2csv_1.Parser();
        const csv = parser.parse(blogData);
        return csv; // You can return the CSV string or save it to a file
    }
    catch (error) {
        throw new Error(`Error exporting blogs: ${error.message}`);
    }
};
exports.adminExportBlogs = adminExportBlogs;
const hardDeleteSoftDeletedBlogs = async () => {
    try {
        // Find and remove all soft-deleted blogs
        await blog_model_1.default.deleteMany({ deleted: true });
        console.log("Successfully hard deleted all soft-deleted blogs");
    }
    catch (error) {
        throw new Error(`Failed to hard delete soft-deleted blogs: ${error.message}`);
    }
};
exports.hardDeleteSoftDeletedBlogs = hardDeleteSoftDeletedBlogs;
// Function to soft delete a blog by ID
const softDeleteBlogById = async (blogId) => {
    try {
        await blog_model_1.default.delete({ _id: blogId });
        console.log(`Soft deleted blog with ID: ${blogId}`);
    }
    catch (error) {
        throw new Error(`Failed to soft delete blog: ${error.message}`);
    }
};
exports.softDeleteBlogById = softDeleteBlogById;
