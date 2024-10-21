"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hardDeleteAllSoftDeletedBlogsController = exports.getAllBlogsController = exports.deleteBlogByIdController = exports.updateBlogByIdController = exports.getBlogByIdController = exports.createBlogController = void 0;
const admin_blog_service_1 = require("./admin-blog-service");
const appResponse_1 = require("../../utils/helpers/appResponse");
const catchAsync_1 = require("../../utils/helpers/catchAsync");
// Controller function to create a new blog
async function createBlogController(req, res) {
    try {
        const blogData = req.body; // Assuming blog data is sent in the request body
        const newBlog = await (0, admin_blog_service_1.adminCreateBlog)(blogData);
        (0, appResponse_1.successResponse)(newBlog, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.createBlogController = createBlogController;
// Controller function to get a blog by ID
async function getBlogByIdController(req, res) {
    try {
        const blogId = req.params.id;
        const blog = await (0, admin_blog_service_1.adminGetBlogById)(blogId);
        if (!blog) {
            res.status(404).json({ message: 'Blog not found' });
            return;
        }
        (0, appResponse_1.successResponse)(blog, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.getBlogByIdController = getBlogByIdController;
// Controller function to update a blog by ID
async function updateBlogByIdController(req, res) {
    try {
        const blogId = req.params.id;
        const updateData = req.body;
        const updatedBlog = await (0, admin_blog_service_1.adminUpdateBlogById)(blogId, updateData);
        if (!updatedBlog) {
            res.status(404).json({ message: 'Blog not found' });
            return;
        }
        (0, appResponse_1.successResponse)(updatedBlog, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.updateBlogByIdController = updateBlogByIdController;
// Controller function to soft delete a blog by ID
async function deleteBlogByIdController(req, res) {
    try {
        const blogId = req.params.id;
        await (0, admin_blog_service_1.adminDeleteBlogById)(blogId);
        (0, appResponse_1.successResponse)({ message: 'Blog deleted successfully' }, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.deleteBlogByIdController = deleteBlogByIdController;
// Controller function to get all blogs with pagination
exports.getAllBlogsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = req.query; // Assuming options are passed as query params
    const blogs = await (0, admin_blog_service_1.adminGetAllBlogs)(options);
    return (0, appResponse_1.successResponse)(blogs, res, { message: "Blogs fetched successfully!" });
});
// Controller function to hard delete all soft deleted blogs
exports.hardDeleteAllSoftDeletedBlogsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await (0, admin_blog_service_1.hardDeleteSoftDeletedBlogs)();
    return (0, appResponse_1.successResponse)({ message: "All soft-deleted blogs have been permanently deleted!" }, res);
});
