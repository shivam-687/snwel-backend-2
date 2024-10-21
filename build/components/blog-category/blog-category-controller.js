"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hardDeleteAllSoftDeletedBlogCategoriesController = exports.getAllBlogCategoriesController = exports.deleteBlogCategoryByIdController = exports.updateBlogCategoryByIdController = exports.getBlogCategoryByIdController = exports.createBlogCategoryController = void 0;
const blog_category_service_1 = require("./blog-category-service");
const appResponse_1 = require("../../utils/helpers/appResponse");
const catchAsync_1 = require("../../utils/helpers/catchAsync");
const mongoose_1 = require("mongoose");
// Controller function to create a new blog category
exports.createBlogCategoryController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const categoryData = req.body; // Assuming blog category data is sent in the request body
    const newCategory = await (0, blog_category_service_1.adminCreateBlogCategory)(categoryData);
    (0, appResponse_1.successResponse)(newCategory, res, { message: "Blog category created successfully!" });
});
// Controller function to get a blog category by ID or slug
exports.getBlogCategoryByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    // Validate the ID or slug
    if (!id || !mongoose_1.Types.ObjectId.isValid(id) && typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid category ID or slug.' });
    }
    const category = await (0, blog_category_service_1.adminGetBlogCategoryById)(id);
    if (!category) {
        return res.status(404).json({ message: 'Blog category not found' });
    }
    (0, appResponse_1.successResponse)(category, res);
});
// Controller function to update a blog category by ID
exports.updateBlogCategoryByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    // Validate the ID
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid category ID.' });
    }
    const updatedCategory = await (0, blog_category_service_1.adminUpdateBlogCategoryById)(id, updateData);
    if (!updatedCategory) {
        return res.status(404).json({ message: 'Blog category not found' });
    }
    (0, appResponse_1.successResponse)(updatedCategory, res, { message: "Blog category updated successfully!" });
});
// Controller function to soft delete a blog category by ID
exports.deleteBlogCategoryByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    // Validate the ID
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid category ID.' });
    }
    await (0, blog_category_service_1.adminDeleteBlogCategoryById)(id);
    (0, appResponse_1.successResponse)({ message: 'Blog category deleted successfully' }, res);
});
// Controller function to get all blog categories with pagination
exports.getAllBlogCategoriesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = req.query; // Assuming options are passed as query params
    const categories = await (0, blog_category_service_1.adminGetAllBlogCategories)(options);
    (0, appResponse_1.successResponse)(categories, res, { message: "Blog categories fetched successfully!" });
});
// Controller function to hard delete all soft-deleted blog categories
exports.hardDeleteAllSoftDeletedBlogCategoriesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await (0, blog_category_service_1.hardDeleteSoftDeletedBlogCategories)();
    (0, appResponse_1.successResponse)({ message: "All soft-deleted blog categories have been permanently deleted!" }, res);
});
