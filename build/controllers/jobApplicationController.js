"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportJobApplicationsController = exports.getAllJobApplicationsController = exports.deleteJobApplicationByIdController = exports.updateJobApplicationByIdController = exports.getJobApplicationByIdController = exports.createJobApplicationController = void 0;
const JobApplication_1 = require("../service/JobApplication");
const appResponse_1 = require("../utils/helpers/appResponse");
const catchAsync_1 = require("../utils/helpers/catchAsync");
// Controller function to create a new job application
async function createJobApplicationController(req, res) {
    try {
        const jobApplicationData = req.body; // Assuming job application data is sent in the request body
        const newJobApplication = await (0, JobApplication_1.createJobApplication)(jobApplicationData);
        (0, appResponse_1.successResponse)(newJobApplication, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.createJobApplicationController = createJobApplicationController;
// Controller function to get a job application by ID
async function getJobApplicationByIdController(req, res) {
    try {
        const jobApplicationId = req.params.id;
        const jobApplication = await (0, JobApplication_1.getJobApplicationById)(jobApplicationId);
        if (!jobApplication) {
            res.status(404).json({ message: 'Job Application not found' });
            return;
        }
        (0, appResponse_1.successResponse)(jobApplication, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.getJobApplicationByIdController = getJobApplicationByIdController;
// Controller function to update a job application by ID
async function updateJobApplicationByIdController(req, res) {
    try {
        const jobApplicationId = req.params.id;
        const updateData = req.body;
        const updatedJobApplication = await (0, JobApplication_1.updateJobApplicationById)(jobApplicationId, updateData);
        if (!updatedJobApplication) {
            res.status(404).json({ message: 'Job Application not found' });
            return;
        }
        (0, appResponse_1.successResponse)(updatedJobApplication, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.updateJobApplicationByIdController = updateJobApplicationByIdController;
// Controller function to delete a job application by ID
async function deleteJobApplicationByIdController(req, res) {
    try {
        const jobApplicationId = req.params.id;
        await (0, JobApplication_1.deleteJobApplicationById)(jobApplicationId);
        (0, appResponse_1.successResponse)({ message: 'Job Application deleted successfully' }, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.deleteJobApplicationByIdController = deleteJobApplicationByIdController;
// Controller function to get all job applications with pagination
exports.getAllJobApplicationsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = req.query;
    const jobApplications = await (0, JobApplication_1.getAllJobApplications)(options);
    return (0, appResponse_1.successResponse)(jobApplications, res, { message: "Job Applications fetched successfully!" });
});
exports.exportJobApplicationsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = req.query;
    const csvData = await (0, JobApplication_1.exportJobApplications)(options);
    res.header('Content-Type', 'text/csv');
    res.attachment(`job_applications_${options.page}.csv`);
    res.send(csvData);
});
