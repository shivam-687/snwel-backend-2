"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJobVacancyByIdController = exports.updateJobVacancyByIdController = exports.getJobVacancyController = exports.getAllJobVacanciesController = exports.createJobVacancyController = void 0;
const jobVacancyService_1 = require("../service/jobVacancyService");
const appResponse_1 = require("../utils/helpers/appResponse");
const catchAsync_1 = require("../utils/helpers/catchAsync");
const helpers_1 = require("../utils/helpers");
const createJobVacancyController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const jobData = req.body;
    const newJobVacancy = await (0, jobVacancyService_1.createJobVacancy)(jobData);
    (0, appResponse_1.successResponse)(newJobVacancy, res, { message: 'Job vacancy created successfully!' });
});
exports.createJobVacancyController = createJobVacancyController;
const getAllJobVacanciesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = Object.assign({}, req.query);
    const jobVacancies = await (0, jobVacancyService_1.getAllJobVacancies)((0, helpers_1.extractListOptions)(req));
    (0, appResponse_1.successResponse)(jobVacancies, res, { message: 'Job vacancies fetched successfully!' });
});
exports.getAllJobVacanciesController = getAllJobVacanciesController;
const getJobVacancyController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { idOrSlug } = req.params;
    const jobVacancy = await (0, jobVacancyService_1.getJobVacancy)(idOrSlug);
    if (!jobVacancy) {
        return (0, appResponse_1.errorResponse)('Job vacancy not found', res);
    }
    (0, appResponse_1.successResponse)(jobVacancy, res, { message: 'Job vacancy fetched successfully!' });
});
exports.getJobVacancyController = getJobVacancyController;
const updateJobVacancyByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const updatedJobVacancy = await (0, jobVacancyService_1.updateJobVacancyById)(id, updateData);
    if (!updatedJobVacancy) {
        return (0, appResponse_1.errorResponse)('Job vacancy not found', res);
    }
    (0, appResponse_1.successResponse)(updatedJobVacancy, res, { message: 'Job vacancy updated successfully!' });
});
exports.updateJobVacancyByIdController = updateJobVacancyByIdController;
const deleteJobVacancyByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await (0, jobVacancyService_1.deleteJobVacancyById)(id);
    (0, appResponse_1.successResponse)(null, res, { message: 'Job vacancy deleted successfully!' });
});
exports.deleteJobVacancyByIdController = deleteJobVacancyByIdController;
