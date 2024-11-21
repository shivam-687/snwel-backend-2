"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hardDeleteAllSoftDeletedBlogCategoriesController = exports.getAllBlogCategoriesController = exports.deleteBlogCategoryByIdController = exports.updateBlogCategoryByIdController = exports.getBlogCategoryByIdController = exports.createBlogCategoryController = void 0;
const blog_category_service_1 = require("./blog-category-service");
const appResponse_1 = require("../../utils/helpers/appResponse");
const catchAsync_1 = require("../../utils/helpers/catchAsync");
const mongoose_1 = require("mongoose");
exports.createBlogCategoryController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const categoryData = req.body;
    const newCategory = await (0, blog_category_service_1.adminCreateBlogCategory)(categoryData);
    (0, appResponse_1.successResponse)(newCategory, res, { message: "Blog category created successfully!" });
});
exports.getBlogCategoryByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    if (!id || !mongoose_1.Types.ObjectId.isValid(id) && typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid category ID or slug.' });
    }
    const category = await (0, blog_category_service_1.adminGetBlogCategoryById)(id);
    if (!category) {
        return res.status(404).json({ message: 'Blog category not found' });
    }
    (0, appResponse_1.successResponse)(category, res);
});
exports.updateBlogCategoryByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid category ID.' });
    }
    const updatedCategory = await (0, blog_category_service_1.adminUpdateBlogCategoryById)(id, updateData);
    if (!updatedCategory) {
        return res.status(404).json({ message: 'Blog category not found' });
    }
    (0, appResponse_1.successResponse)(updatedCategory, res, { message: "Blog category updated successfully!" });
});
exports.deleteBlogCategoryByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid category ID.' });
    }
    await (0, blog_category_service_1.adminDeleteBlogCategoryById)(id);
    (0, appResponse_1.successResponse)({ message: 'Blog category deleted successfully' }, res);
});
exports.getAllBlogCategoriesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = req.query;
    const categories = await (0, blog_category_service_1.adminGetAllBlogCategories)(options);
    (0, appResponse_1.successResponse)(categories, res, { message: "Blog categories fetched successfully!" });
});
exports.hardDeleteAllSoftDeletedBlogCategoriesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await (0, blog_category_service_1.hardDeleteSoftDeletedBlogCategories)();
    (0, appResponse_1.successResponse)({ message: "All soft-deleted blog categories have been permanently deleted!" }, res);
});
