"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportJobApplications = exports.getAllJobApplications = exports.deleteJobApplicationById = exports.updateJobApplicationById = exports.getJobApplicationById = exports.createJobApplication = void 0;
const JobApplicationModel_1 = __importDefault(require("../models/JobApplicationModel"));
const helpers_1 = require("../utils/helpers");
const mongoose_1 = require("mongoose");
const json2csv_1 = require("json2csv");
const notificationService_1 = require("./notificationService");
async function createJobApplication(data) {
    try {
        const jobApplication = await JobApplicationModel_1.default.create(data);
        try {
            await jobApplication.populate("jobId");
            await (0, notificationService_1.sendJobApplyConfirmation)(jobApplication, {
                email: jobApplication.email,
                phone: jobApplication.phone
            });
        }
        catch (error) {
            console.error("Failed to send mail to", jobApplication.email, error);
        }
        return jobApplication.toObject();
    }
    catch (error) {
        console.error(`Failed to create job application: ${error.message}`, error);
        throw new Error(`Failed to create job application: ${error.message}`);
    }
}
exports.createJobApplication = createJobApplication;
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
async function deleteJobApplicationById(jobApplicationId) {
    try {
        await JobApplicationModel_1.default.findByIdAndDelete(jobApplicationId);
    }
    catch (error) {
        throw new Error(`Failed to delete job application: ${error.message}`);
    }
}
exports.deleteJobApplicationById = deleteJobApplicationById;
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
        const jobAppsData = jobApplications.docs;
        const parser = new json2csv_1.Parser();
        const csv = parser.parse(jobAppsData);
        return csv;
    }
    catch (error) {
        throw new Error(`Error exporting job applications: ${error.message}`);
    }
};
exports.exportJobApplications = exportJobApplications;
