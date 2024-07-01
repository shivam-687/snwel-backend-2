"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJobCategoryById = exports.updateJobCategoryById = exports.getJobCategoryById = exports.getAllJobCategories = exports.createJobCategory = void 0;
const JobCategory_1 = __importDefault(require("../models/JobCategory"));
const helpers_1 = require("../utils/helpers");
const createJobCategory = async (categoryData) => {
    try {
        const newJobCategory = new JobCategory_1.default(categoryData);
        return await newJobCategory.save();
    }
    catch (error) {
        throw new Error(`Error: creating job category: ${error.message}`);
    }
};
exports.createJobCategory = createJobCategory;
const getAllJobCategories = async (options) => {
    try {
        const { limit = 10, page = 1, search } = options;
        const query = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ name: searchRegex }];
        }
        const skip = (page - 1) * limit;
        const jobVacancies = await JobCategory_1.default.find(query)
            .skip(skip)
            .limit(limit)
            .exec();
        const count = await JobCategory_1.default.countDocuments(query);
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        return (0, helpers_1.convertToPagination)(jobVacancies, count, paginationData.limit, paginationData.offset);
    }
    catch (error) {
        throw new Error(`Error: retrieving job categories: ${error.message}`);
    }
};
exports.getAllJobCategories = getAllJobCategories;
const getJobCategoryById = async (categoryId) => {
    try {
        return await JobCategory_1.default.findById(categoryId);
    }
    catch (error) {
        throw new Error(`Error: retrieving job category: ${error.message}`);
    }
};
exports.getJobCategoryById = getJobCategoryById;
const updateJobCategoryById = async (categoryId, updateData) => {
    try {
        return await JobCategory_1.default.findByIdAndUpdate(categoryId, updateData, { new: true });
    }
    catch (error) {
        throw new Error(`Error: updating job category: ${error.message}`);
    }
};
exports.updateJobCategoryById = updateJobCategoryById;
const deleteJobCategoryById = async (categoryId) => {
    try {
        await JobCategory_1.default.findByIdAndDelete(categoryId);
    }
    catch (error) {
        throw new Error(`Error: deleting job category: ${error.message}`);
    }
};
exports.deleteJobCategoryById = deleteJobCategoryById;
