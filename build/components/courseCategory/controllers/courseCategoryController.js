"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachParentCategory = exports.deleteCategoryById = exports.updateCategoryById = exports.getCategoryById = exports.createCategory = exports.getAllCategories = exports.attachParent = void 0;
const courseCategoryService_1 = require("../services/courseCategoryService");
Object.defineProperty(exports, "attachParentCategory", { enumerable: true, get: function () { return courseCategoryService_1.attachParentCategory; } });
const appResponse_1 = require("../../../utils/helpers/appResponse");
const logger_1 = require("../../../utils/logger");
// Controller function to get all course categories
const getAllCategories = async (req, res) => {
    try {
        const courseCategories = await (0, courseCategoryService_1.getAllCourseCategories)({ ...req.query });
        (0, appResponse_1.successResponse)(courseCategories, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
};
exports.getAllCategories = getAllCategories;
// Controller function to create a course category
const createCategory = async (req, res) => {
    try {
        const newCategory = await (0, courseCategoryService_1.createCourseCategory)(req.body);
        (0, appResponse_1.successResponse)(newCategory, res);
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
            (0, appResponse_1.errorResponse)(null, res, { status: 404, message: "Category not found!" });
            return;
        }
        (0, appResponse_1.successResponse)(category, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
};
exports.getCategoryById = getCategoryById;
// Controller function to update a course category by ID
const updateCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updatedCategory = await (0, courseCategoryService_1.updateCourseCategoryById)(categoryId, req.body);
        if (!updatedCategory) {
            (0, appResponse_1.errorResponse)(null, res, { status: 404, message: "Category not found!" });
            return;
        }
        (0, appResponse_1.successResponse)(updatedCategory, res, { message: "Categopry updated successfully" });
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
};
exports.updateCategoryById = updateCategoryById;
// Controller function to delete a course category by ID
const deleteCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        await (0, courseCategoryService_1.deleteCourseCategoryById)(categoryId);
        (0, appResponse_1.successResponse)({ id: categoryId }, res, { message: "Category deleted successfully" });
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
};
exports.deleteCategoryById = deleteCategoryById;
async function attachParent(req, res) {
    const { targetCategoryId, parentCategoryId } = req.body;
    try {
        const updated = await (0, courseCategoryService_1.attachParentCategory)(targetCategoryId, parentCategoryId);
        (0, appResponse_1.successResponse)(updated, res, { message: 'Parent category attached successfully' });
    }
    catch (error) {
        logger_1.logger.error(error);
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.attachParent = attachParent;
