"use strict";
// src/services/blogService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportBlogs = exports.getAllBlogs = exports.deleteBlogById = exports.updateBlogById = exports.getBlogById = exports.createBlog = void 0;
const blog_model_1 = __importDefault(require("./blog-model"));
const helpers_1 = require("../../utils/helpers");
const mongoose_1 = require("mongoose");
const json2csv_1 = require("json2csv");
// Function to create a new blog
async function createBlog(data) {
    try {
        const blog = await blog_model_1.default.create(data);
        return blog.toObject();
    }
    catch (error) {
        console.error(`Failed to create blog: ${error.message}`, error);
        throw new Error(`Failed to create blog: ${error.message}`);
    }
}
exports.createBlog = createBlog;
// Function to get a blog by ID
async function getBlogById(blogId) {
    try {
        const query = mongoose_1.Types.ObjectId.isValid(blogId)
            ? { _id: blogId }
            : { slug: blogId };
        const blog = await blog_model_1.default.findOne(query).populate('author', '_id profilePic name email').lean();
        return blog;
    }
    catch (error) {
        throw error;
    }
}
exports.getBlogById = getBlogById;
// Function to update a blog by ID
async function updateBlogById(blogId, updateData) {
    try {
        const blog = await blog_model_1.default.findByIdAndUpdate(blogId, updateData, { new: true });
        return blog;
    }
    catch (error) {
        throw new Error(`Failed to update blog: ${error.message}`);
    }
}
exports.updateBlogById = updateBlogById;
// Function to delete a blog by ID
async function deleteBlogById(blogId) {
    try {
        await blog_model_1.default.findByIdAndDelete(blogId);
    }
    catch (error) {
        throw new Error(`Failed to delete blog: ${error.message}`);
    }
}
exports.deleteBlogById = deleteBlogById;
// Function to get all blogs with pagination
const getAllBlogs = async (options) => {
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
        const blogs = await blog_model_1.default.paginate(query, {
            page,
            limit,
            sort: sort ? (0, helpers_1.convertSortOrder)(sort) : { createdAt: -1 },
            populate: [
                {
                    path: 'category',
                    select: "_id name slug"
                }
            ]
        });
        return blogs;
    }
    catch (error) {
        throw new Error(`Error retrieving blogs: ${error.message}`);
    }
};
exports.getAllBlogs = getAllBlogs;
// Function to export blogs to CSV
const exportBlogs = async (options) => {
    try {
        const blogs = await (0, exports.getAllBlogs)(options);
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
exports.exportBlogs = exportBlogs;
// Function to hard delete all soft-deleted blogs