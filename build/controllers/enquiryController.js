"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnquiryByIdController = exports.updateEnquiryByIdController = exports.getEnquiryByIdController = exports.getAllEnquiriesController = exports.createEnquiryController = void 0;
const enquiryService_1 = require("../service/enquiryService");
const appResponse_1 = require("../utils/helpers/appResponse");
const catchAsync_1 = require("../utils/helpers/catchAsync");
const helpers_1 = require("../utils/helpers");
const createEnquiryController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const enquiryData = req.body;
    if (enquiryData === null || enquiryData === void 0 ? void 0 : enquiryData.isUnique) {
        const exists = await (0, enquiryService_1.getEnquiryByEmailAndType)(enquiryData.email, enquiryData.type);
        if (exists)
            throw new Error("Error: 400:Your Enquiry already exists!!");
    }
    const newEnquiry = await (0, enquiryService_1.createEnquiry)(enquiryData);
    (0, appResponse_1.successResponse)(newEnquiry, res, { message: 'Enquiry created successfully!' });
});
exports.createEnquiryController = createEnquiryController;
const getAllEnquiriesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = Object.assign({}, req.query);
    const enquiries = await (0, enquiryService_1.getAllEnquiries)((0, helpers_1.extractListOptions)(req));
    (0, appResponse_1.successResponse)(enquiries, res, { message: 'Enquiries fetched successfully!' });
});
exports.getAllEnquiriesController = getAllEnquiriesController;
const getEnquiryByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const enquiry = await (0, enquiryService_1.getEnquiryById)(id);
    if (!enquiry) {
        return (0, appResponse_1.errorResponse)('Enquiry not found', res);
    }
    (0, appResponse_1.successResponse)(enquiry, res, { message: 'Enquiry fetched successfully!' });
});
exports.getEnquiryByIdController = getEnquiryByIdController;
const updateEnquiryByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const updatedEnquiry = await (0, enquiryService_1.updateEnquiryById)(id, updateData);
    if (!updatedEnquiry) {
        return (0, appResponse_1.errorResponse)('Enquiry not found', res);
    }
    (0, appResponse_1.successResponse)(updatedEnquiry, res, { message: 'Enquiry updated successfully!' });
});
exports.updateEnquiryByIdController = updateEnquiryByIdController;
const deleteEnquiryByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await (0, enquiryService_1.deleteEnquiryById)(id);
    (0, appResponse_1.successResponse)(null, res, { message: 'Enquiry deleted successfully!' });
});
exports.deleteEnquiryByIdController = deleteEnquiryByIdController;
