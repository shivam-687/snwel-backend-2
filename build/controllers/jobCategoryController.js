"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJobCategoryByIdController = exports.updateJobCategoryByIdController = exports.getJobCategoryByIdController = exports.getAllJobCategoriesController = exports.createJobCategoryController = void 0;
const jobCategoryService_1 = require("../service/jobCategoryService");
const appResponse_1 = require("../utils/helpers/appResponse");
const catchAsync_1 = require("../utils/helpers/catchAsync");
const helpers_1 = require("../utils/helpers");
const createJobCategoryController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const categoryData = req.body;
    const newJobCategory = await (0, jobCategoryService_1.createJobCategory)(categoryData);
    (0, appResponse_1.successResponse)(newJobCategory, res, { message: 'Job category created successfully!' });
});
exports.createJobCategoryController = createJobCategoryController;
const getAllJobCategoriesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = { ...req.query };
    const jobCategories = await (0, jobCategoryService_1.getAllJobCategories)((0, helpers_1.extractListOptions)(req));
    (0, appResponse_1.successResponse)(jobCategories, res, { message: 'Job categories fetched successfully!' });
});
exports.getAllJobCategoriesController = getAllJobCategoriesController;
const getJobCategoryByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const jobCategory = await (0, jobCategoryService_1.getJobCategoryById)(id);
    if (!jobCategory) {
        return (0, appResponse_1.errorResponse)('Job category not found', res);
    }
    (0, appResponse_1.successResponse)(jobCategory, res, { message: 'Job category fetched successfully!' });
});
exports.getJobCategoryByIdController = getJobCategoryByIdController;
const updateJobCategoryByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const updatedJobCategory = await (0, jobCategoryService_1.updateJobCategoryById)(id, updateData);
    if (!updatedJobCategory) {
        return (0, appResponse_1.errorResponse)('Job category not found', res);
    }
    (0, appResponse_1.successResponse)(updatedJobCategory, res, { message: 'Job category updated successfully!' });
});
exports.updateJobCategoryByIdController = updateJobCategoryByIdController;
const deleteJobCategoryByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await (0, jobCategoryService_1.deleteJobCategoryById)(id);
    (0, appResponse_1.successResponse)(null, res, { message: 'Job category deleted successfully!' });
});
exports.deleteJobCategoryByIdController = deleteJobCategoryByIdController;
