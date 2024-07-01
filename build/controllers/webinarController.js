"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllWebinarController = exports.addHostsToWebinarController = exports.deleteWebinarByIdController = exports.updateWebinarByIdController = exports.getWebinarBySlugController = exports.getWebinarByIdController = exports.createWebinarController = void 0;
// Import webinar service functions
const webinarService_1 = require("../service/webinarService");
const appResponse_1 = require("../utils/helpers/appResponse");
const catchAsync_1 = require("../utils/helpers/catchAsync");
const helpers_1 = require("../utils/helpers");
// Controller function to create a new webinar
async function createWebinarController(req, res) {
    try {
        const webinarData = req.body; // Assuming webinar data is sent in the request body
        const newWebinar = await (0, webinarService_1.createWebinar)(webinarData);
        (0, appResponse_1.successResponse)(newWebinar, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.createWebinarController = createWebinarController;
// Controller function to get a webinar by ID
async function getWebinarByIdController(req, res) {
    try {
        const webinarId = req.params.id;
        const webinar = await (0, webinarService_1.getWebinarById)(webinarId);
        if (!webinar) {
            res.status(404).json({ message: 'Webinar not found' });
            return;
        }
        (0, appResponse_1.successResponse)(webinar, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.getWebinarByIdController = getWebinarByIdController;
async function getWebinarBySlugController(req, res) {
    try {
        const webinarSlug = req.params.slug;
        const webinar = await (0, webinarService_1.getWebinarBySlug)(webinarSlug);
        if (!webinar) {
            res.status(404).json({ message: 'Webinar not found' });
            return;
        }
        (0, appResponse_1.successResponse)(webinar, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.getWebinarBySlugController = getWebinarBySlugController;
// Controller function to update a webinar by ID
async function updateWebinarByIdController(req, res) {
    try {
        const webinarId = req.params.id;
        const updateData = req.body;
        const updatedWebinar = await (0, webinarService_1.updateWebinarById)(webinarId, updateData);
        if (!updatedWebinar) {
            res.status(404).json({ message: 'Webinar not found' });
            return;
        }
        (0, appResponse_1.successResponse)(updatedWebinar, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.updateWebinarByIdController = updateWebinarByIdController;
// Controller function to delete a webinar by ID
async function deleteWebinarByIdController(req, res) {
    try {
        const webinarId = req.params.id;
        await (0, webinarService_1.deleteWebinarById)(webinarId);
        (0, appResponse_1.successResponse)({ message: 'Hosts deleted successfully' }, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.deleteWebinarByIdController = deleteWebinarByIdController;
// Controller function to add hosts to a webinar
async function addHostsToWebinarController(req, res) {
    try {
        const webinarId = req.params.id;
        const { hosts } = req.body;
        await (0, webinarService_1.addHosts)(webinarId, hosts);
        (0, appResponse_1.successResponse)({ message: 'Hosts added successfully' }, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.addHostsToWebinarController = addHostsToWebinarController;
exports.getAllWebinarController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const courses = await (0, webinarService_1.getAllWebinars)((0, helpers_1.extractListOptions)(req));
    return (0, appResponse_1.successResponse)(courses, res, { message: "Webinars Fetched successfully!" });
});
