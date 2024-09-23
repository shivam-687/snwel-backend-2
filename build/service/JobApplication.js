"use strict";
// src/services/jobApplicationService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportJobApplications = exports.getAllJobApplications = exports.deleteJobApplicationById = exports.updateJobApplicationById = exports.getJobApplicationById = exports.createJobApplication = void 0;
const JobApplicationModel_1 = __importDefault(require("../models/JobApplicationModel"));
const helpers_1 = require("../utils/helpers");
const mongoose_1 = require("mongoose");
const json2csv_1 = require("json2csv");
// Function to create a new job application
async function createJobApplication(data) {
    try {
        const jobApplication = await JobApplicationModel_1.default.create(data);
        return jobApplication.toObject();
    }
    catch (error) {
        throw new Error(`Failed to create job application: ${error.message}`);
    }
}
exports.createJobApplication = createJobApplication;
// Function to get a job application by ID
async function getJobApplicationById(jobApplicationId) {
    try {
        const query = mongoose_1.Types.ObjectId.isValid(jobApplicationId)
            ? { _id: jobApplicationId }
            : { jobId: jobApplicationId };
        const jobApplication = await JobApplicationModel_1.default.findOne(query);
        return jobApplication ? jobApplication.toObject() : null;
    }
    catch (error) {
        throw new Error(`Failed to get job application: ${error.message}`);
    }
}
exports.getJobApplicationById = getJobApplicationById;
// Function to update a job application by ID
async function updateJobApplicationById(jobApplicationId, updateData) {
    try {
        const jobApplication = await JobApplicationModel_1.default.findByIdAndUpdate(jobApplicationId, updateData, { new: true });
        return jobApplication ? jobApplication.toObject() : null;
    }
    catch (error) {
        throw new Error(`Failed to update job application: ${error.message}`);
    }
}
exports.updateJobApplicationById = updateJobApplicationById;
// Function to delete a job application by ID
async function deleteJobApplicationById(jobApplicationId) {
    try {
        await JobApplicationModel_1.default.findByIdAndDelete(jobApplicationId);
    }
    catch (error) {
        throw new Error(`Failed to delete job application: ${error.message}`);
    }
}
exports.deleteJobApplicationById = deleteJobApplicationById;
// Function to get all job applications with pagination
const getAllJobApplications = async (options) => {
    try {
        const { limit = 10, page = 1, search, filter, sort, startDate, endDate } = options;
        const query = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ applicantName: searchRegex }, { email: searchRegex }];
        }
        if (filter && filter.status) {
            query.status = filter.status;
        }
        if (startDate || endDate) {
            query.appliedDate = {};
            if (startDate) {
                query.appliedDate.$gte = new Date(startDate);
            }
            if (endDate) {
                query.appliedDate.$lte = new Date(endDate);
            }
        }
        const jobApplications = await JobApplicationModel_1.default.paginate(query, {
            populate: {
                path: 'jobId',
                select: ['title', 'slug', '_id', 'companyName']
            },
            page,
            limit,
            sort: sort ? (0, helpers_1.convertSortOrder)(sort) : { appliedDate: -1 }
        });
        return jobApplications;
    }
    catch (error) {
        throw new Error(`Error retrieving job applications: ${error.message}`);
    }
};
exports.getAllJobApplications = getAllJobApplications;
const exportJobApplications = async (options) => {
    try {
        const jobApplications = await (0, exports.getAllJobApplications)(options);
        const jobAppsData = jobApplications.docs; // Extract the documents from the paginated result
        // Convert the data to CSV format
        const parser = new json2csv_1.Parser();
        const csv = parser.parse(jobAppsData);
        // You can return the CSV string or save it to a file depending on your needs
        return csv;
    }
    catch (error) {
        throw new Error(`Error exporting job applications: ${error.message}`);
    }
};
exports.exportJobApplications = exportJobApplications;
