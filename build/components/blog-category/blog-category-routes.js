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
router.post('/categories', passport_config_1.default.authenticate('jwt', { session: false }), blog_category_controller_1.createBlogCategoryController);
router.get('/categories/:id', blog_category_controller_1.getBlogCategoryByIdController);
router.put('/categories/:id', passport_config_1.default.authenticate('jwt', { session: false }), blog_category_controller_1.updateBlogCategoryByIdController);
router.delete('/categories/:id', passport_config_1.default.authenticate('jwt', { session: false }), blog_category_controller_1.deleteBlogCategoryByIdController);
router.get('/categories', blog_category_controller_1.getAllBlogCategoriesController);
router.delete('/categories/hard-delete', passport_config_1.default.authenticate('jwt', { session: false }), blog_category_controller_1.hardDeleteAllSoftDeletedBlogCategoriesController);
