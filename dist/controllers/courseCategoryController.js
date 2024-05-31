"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryById = exports.updateCategoryById = exports.getCategoryById = exports.createCategory = exports.getAllCategories = void 0;
const courseCategoryService_1 = require("@/service/courseCategoryService");
// Controller function to get all course categories
const getAllCategories = async (req, res) => {
    try {
        const courseCategories = await (0, courseCategoryService_1.getAllCourseCategories)();
        res.status(200).json(courseCategories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllCategories = getAllCategories;
// Controller function to create a course category
const createCategory = async (req, res) => {
    try {
        const newCategory = await (0, courseCategoryService_1.createCourseCategory)(req.body);
        res.status(201).json(newCategory);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createCategory = createCategory;
// Controller function to get a course category by ID
const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await (0, courseCategoryService_1.getCourseCategoryById)(categoryId);
        if (!category) {
            res.status(404).json({ message: 'Course category not found' });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCategoryById = getCategoryById;
// Controller function to update a course category by ID
const updateCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updatedCategory = await (0, courseCategoryService_1.updateCourseCategoryById)(categoryId, req.body);
        if (!updatedCategory) {
            res.status(404).json({ message: 'Course category not found' });
            return;
        }
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateCategoryById = updateCategoryById;
// Controller function to delete a course category by ID
const deleteCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        await (0, courseCategoryService_1.deleteCourseCategoryById)(categoryId);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteCategoryById = deleteCategoryById;
