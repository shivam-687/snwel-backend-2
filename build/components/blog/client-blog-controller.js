"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBlogsController = exports.getBlogByIdController = void 0;
const client_blog_service_1 = require("./client-blog-service");
const appResponse_1 = require("../../utils/helpers/appResponse");
const catchAsync_1 = require("../../utils/helpers/catchAsync");
async function getBlogByIdController(req, res) {
    try {
        const blogId = req.params.id;
        const blog = await (0, client_blog_service_1.getBlogById)(blogId);
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
exports.getAllBlogsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = req.query;
    const blogs = await (0, client_blog_service_1.getAllBlogs)(options);
    return (0, appResponse_1.successResponse)(blogs, res, { message: "Blogs fetched successfully!" });
});
