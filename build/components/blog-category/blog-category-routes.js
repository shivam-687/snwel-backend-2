"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogCategoryRouter = void 0;
const express_1 = require("express");
const blog_category_controller_1 = require("./blog-category-controller");
const passport_config_1 = __importDefault(require("../../config/passport-config"));
const router = (0, express_1.Router)();
exports.BlogCategoryRouter = router;
// Route to create a new blog category
router.post('/categories', passport_config_1.default.authenticate('jwt', { session: false }), blog_category_controller_1.createBlogCategoryController);
// Route to get a blog category by ID or slug
router.get('/categories/:id', blog_category_controller_1.getBlogCategoryByIdController);
// Route to update a blog category by ID
router.put('/categories/:id', passport_config_1.default.authenticate('jwt', { session: false }), blog_category_controller_1.updateBlogCategoryByIdController);
// Route to soft delete a blog category by ID
router.delete('/categories/:id', passport_config_1.default.authenticate('jwt', { session: false }), blog_category_controller_1.deleteBlogCategoryByIdController);
// Route to get all blog categories with optional filters
router.get('/categories', blog_category_controller_1.getAllBlogCategoriesController);
// Route to hard delete all soft-deleted blog categories
router.delete('/categories/hard-delete', passport_config_1.default.authenticate('jwt', { session: false }), blog_category_controller_1.hardDeleteAllSoftDeletedBlogCategoriesController);
