"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRouter = void 0;
const express_1 = require("express");
const admin_blog_controller_1 = require("./admin-blog-controller");
const passport_config_1 = __importDefault(require("../../config/passport-config"));
const client_blog_controller_1 = require("./client-blog-controller");
const router = (0, express_1.Router)();
exports.BlogRouter = router;
// Route to create a new blog
router.post('/blogs', passport_config_1.default.authenticate('jwt', { session: false }), admin_blog_controller_1.createBlogController);
// Route to get a blog by ID
router.get('/blogs/:id', admin_blog_controller_1.getBlogByIdController);
// Route to update a blog by ID
router.put('/blogs/:id', passport_config_1.default.authenticate('jwt', { session: false }), admin_blog_controller_1.updateBlogByIdController);
// Route to soft delete a blog by ID
router.delete('/blogs/:id', passport_config_1.default.authenticate('jwt', { session: false }), admin_blog_controller_1.deleteBlogByIdController);
// Route to get all blogs with optional filters
router.get('/blogs', admin_blog_controller_1.getAllBlogsController);
// Route to hard delete all soft-deleted blogs
router.delete('/blogs/hard-delete', passport_config_1.default.authenticate('jwt', { session: false }), admin_blog_controller_1.hardDeleteAllSoftDeletedBlogsController);
router.get("/guest/blogs", client_blog_controller_1.getAllBlogsController);
router.get("/guest/blogs/:id", admin_blog_controller_1.getBlogByIdController);
