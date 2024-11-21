"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPublicWebinarController = exports.getAllWebinarController = exports.addHostsToWebinarController = exports.deleteWebinarByIdController = exports.updateWebinarByIdController = exports.getWebinarBySlugController = exports.getWebinarByIdController = exports.createWebinarController = void 0;
const webinarService_1 = require("../service/webinarService");
const appResponse_1 = require("../utils/helpers/appResponse");
const catchAsync_1 = require("../utils/helpers/catchAsync");
async function createWebinarController(req, res) {
    try {
        const webinarData = req.body;
        const newWebinar = await (0, webinarService_1.createWebinar)(webinarData);
        (0, appResponse_1.successResponse)(newWebinar, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.createWebinarController = createWebinarController;
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
    const courses = await (0, webinarService_1.getAllWebinars)(req.query);
    return (0, appResponse_1.successResponse)(courses, res, { message: "Webinars Fetched successfully!" });
});
exports.getAllPublicWebinarController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const courses = await (0, webinarService_1.getAllWebinars)(req.query, true);
    return (0, appResponse_1.successResponse)(courses, res, { message: "Webinars Fetched successfully!" });
});
