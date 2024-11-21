"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteBlogById = exports.hardDeleteSoftDeletedBlogs = exports.adminExportBlogs = exports.adminGetAllBlogs = exports.adminDeleteBlogById = exports.adminUpdateBlogById = exports.adminGetBlogById = exports.adminCreateBlog = void 0;
const blog_model_1 = __importDefault(require("./blog-model"));
const helpers_1 = require("../../utils/helpers");
const mongoose_1 = require("mongoose");
const json2csv_1 = require("json2csv");
async function adminCreateBlog(data) {
    try {
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
async function adminDeleteBlogById(blogId) {
    try {
        await blog_model_1.default.delete({ _id: blogId });
    }
    catch (error) {
        throw new Error(`Failed to delete blog: ${error.message}`);
    }
}
exports.adminDeleteBlogById = adminDeleteBlogById;
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
        switch (filter === null || filter === void 0 ? void 0 : filter.statusFilter) {
            case 'published':
                query.published = true;
                break;
            case 'unpublished':
                query.published = false;
                break;
            case 'all':
                query.published = { $in: [true, false] };
                break;
            default:
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
const adminExportBlogs = async (options) => {
    try {
        const blogs = await (0, exports.adminGetAllBlogs)(options);
        const blogData = blogs.docs;
        const parser = new json2csv_1.Parser();
        const csv = parser.parse(blogData);
        return csv;
    }
    catch (error) {
        throw new Error(`Error exporting blogs: ${error.message}`);
    }
};
exports.adminExportBlogs = adminExportBlogs;
const hardDeleteSoftDeletedBlogs = async () => {
    try {
        await blog_model_1.default.deleteMany({ deleted: true });
        console.log("Successfully hard deleted all soft-deleted blogs");
    }
    catch (error) {
        throw new Error(`Failed to hard delete soft-deleted blogs: ${error.message}`);
    }
};
exports.hardDeleteSoftDeletedBlogs = hardDeleteSoftDeletedBlogs;
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
