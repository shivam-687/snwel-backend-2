"use strict";
// src/controllers/enquiryController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportEnquiriesController = exports.getAllEnquiriesController = exports.deleteEnquiryByIdController = exports.updateEnquiryByIdController = exports.getEnquiryByIdController = exports.createEnquiryController = void 0;
const snwelEnquiryService_1 = require("../service/snwelEnquiryService");
const appResponse_1 = require("../utils/helpers/appResponse");
const catchAsync_1 = require("../utils/helpers/catchAsync");
// Controller function to create a new enquiry
async function createEnquiryController(req, res) {
    try {
        const enquiryData = req.body; // Assuming enquiry data is sent in the request body
        const newEnquiry = await (0, snwelEnquiryService_1.createEnquiry)(enquiryData);
        (0, appResponse_1.successResponse)(newEnquiry, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.createEnquiryController = createEnquiryController;
// Controller function to get an enquiry by ID
async function getEnquiryByIdController(req, res) {
    try {
        const enquiryId = req.params.id;
        const enquiry = await (0, snwelEnquiryService_1.getEnquiryById)(enquiryId);
        if (!enquiry) {
            res.status(404).json({ message: 'Enquiry not found' });
            return;
        }
        (0, appResponse_1.successResponse)(enquiry, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.getEnquiryByIdController = getEnquiryByIdController;
// Controller function to update an enquiry by ID
async function updateEnquiryByIdController(req, res) {
    try {
        const enquiryId = req.params.id;
        const updateData = req.body;
        const updatedEnquiry = await (0, snwelEnquiryService_1.updateEnquiryById)(enquiryId, updateData);
        if (!updatedEnquiry) {
            res.status(404).json({ message: 'Enquiry not found' });
            return;
        }
        (0, appResponse_1.successResponse)(updatedEnquiry, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.updateEnquiryByIdController = updateEnquiryByIdController;
// Controller function to delete an enquiry by ID
async function deleteEnquiryByIdController(req, res) {
    try {
        const enquiryId = req.params.id;
        await (0, snwelEnquiryService_1.deleteEnquiryById)(enquiryId);
        (0, appResponse_1.successResponse)({ message: 'Enquiry deleted successfully' }, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.deleteEnquiryByIdController = deleteEnquiryByIdController;
// Controller function to get all enquiries with pagination
exports.getAllEnquiriesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = req.query;
    const enquiries = await (0, snwelEnquiryService_1.getAllEnquiries)(options);
    return (0, appResponse_1.successResponse)(enquiries, res, { message: "Enquiries fetched successfully!" });
});
// Controller function to export enquiries to CSV
exports.exportEnquiriesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = req.query;
    const csvData = await (0, snwelEnquiryService_1.exportEnquiries)(options);
    res.header('Content-Type', 'text/csv');
    res.attachment(`enquiries_${options.page}.csv`);
    res.send(csvData);
});
