"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const CourseCategory_1 = require("../models/CourseCategory");
const helpers_1 = require("../../../utils/helpers");
class CategoryService {
    static async createCategory(categoryData) {
        try {
            const slug = (0, helpers_1.createSlug)(categoryData.name);
            const category = new CourseCategory_1.CourseCategoryModel(Object.assign(Object.assign({}, categoryData), { slug }));
            return await category.save();
        }
        catch (error) {
            throw error;
        }
    }
    static async updateCategory(categoryId, categoryData) {
        try {
            if (categoryData.name) {
                categoryData.slug = (0, helpers_1.createSlug)(categoryData.name);
            }
            return await CourseCategory_1.CourseCategoryModel.findByIdAndUpdate(categoryId, categoryData, { new: true });
        }
        catch (error) {
            throw error;
        }
    }
    static async deleteCategory(categoryId) {
        try {
            const result = await CourseCategory_1.CourseCategoryModel.findByIdAndDelete(categoryId);
            return !!result;
        }
        catch (error) {
            throw error;
        }
    }
    static async getCategories(query = {}, options = { page: 1, limit: 10 }) {
        try {
            return await CourseCategory_1.CourseCategoryModel.paginate(query, Object.assign(Object.assign({}, options), { populate: 'parentCategory' }));
        }
        catch (error) {
            throw error;
        }
    }
    static async getCategoryById(categoryId) {
        try {
            return await CourseCategory_1.CourseCategoryModel.findById(categoryId)
                .populate('parentCategory');
        }
        catch (error) {
            throw error;
        }
    }
    static async getActiveCategories() {
        try {
            return await CourseCategory_1.CourseCategoryModel.find({ isActive: true })
                .sort({ order: 1 })
                .populate('parentCategory');
        }
        catch (error) {
            throw error;
        }
    }
}
exports.CategoryService = CategoryService;
