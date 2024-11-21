"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllWebinars = exports.addHosts = exports.deleteWebinarById = exports.updateWebinarById = exports.getWebinarBySlug = exports.getWebinarById = exports.createWebinar = void 0;
const WebinarModel_1 = require("../models/WebinarModel");
const helpers_1 = require("../utils/helpers");
const mongoose_1 = require("mongoose");
async function createWebinar(data) {
    try {
        const webinar = await WebinarModel_1.WebinarModel.create(data);
        return webinar.toObject();
    }
    catch (error) {
        throw new Error(`Failed to create webinar: ${error.message}`);
    }
}
exports.createWebinar = createWebinar;
async function getWebinarById(webinarId) {
    try {
        const query = mongoose_1.Types.ObjectId.isValid(webinarId)
            ? { _id: webinarId }
            : { slug: webinarId };
        const webinar = await WebinarModel_1.WebinarModel
            .findOne(query)
            .populate('hosts', ["email", "name"])
            .populate("createdBy", ["email", "name"]);
        return webinar ? webinar.toObject() : null;
    }
    catch (error) {
        throw new Error(`Failed to get webinar: ${error.message}`);
    }
}
exports.getWebinarById = getWebinarById;
async function getWebinarBySlug(slug) {
    try {
        const webinar = await WebinarModel_1.WebinarModel
            .findOne({ slug })
            .populate('hosts', ["email", "name"])
            .populate("createdBy", ["email", "name"]);
        return webinar ? webinar.toObject() : null;
    }
    catch (error) {
        throw new Error(`Failed to get webinar: ${error.message}`);
    }
}
exports.getWebinarBySlug = getWebinarBySlug;
async function updateWebinarById(webinarId, updateData) {
    try {
        const webinar = await WebinarModel_1.WebinarModel
            .findByIdAndUpdate(webinarId, updateData, { new: true })
            .populate('hosts', ["email", "name"])
            .populate("createdBy", ["email", "name"]);
        return webinar ? webinar.toObject() : null;
    }
    catch (error) {
        throw new Error(`Failed to update webinar: ${error.message}`);
    }
}
exports.updateWebinarById = updateWebinarById;
async function deleteWebinarById(webinarId) {
    try {
        await WebinarModel_1.WebinarModel.findByIdAndDelete(webinarId);
    }
    catch (error) {
        throw new Error(`Failed to delete webinar: ${error.message}`);
    }
}
exports.deleteWebinarById = deleteWebinarById;
async function addHosts(webinarId, hosts) {
    try {
        const webinar = await WebinarModel_1.WebinarModel.findById(webinarId);
        if (!webinar) {
            throw new Error('Webinar not found');
        }
        const uniqueHosts = new Set(hosts.map(h => new mongoose_1.Types.ObjectId(h)));
        const newHosts = [...uniqueHosts].filter(host => !webinar.hosts.includes(host));
        webinar.hosts.push(...newHosts);
        await webinar.save();
        return webinar.toObject();
    }
    catch (error) {
        throw new Error(`Failed to add hosts to webinar: ${error.message}`);
    }
}
exports.addHosts = addHosts;
const getAllWebinars = async (options, adminMode = false) => {
    try {
        const { limit = 10, page = 1, search, filter, sort } = options;
        const query = {};
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        if (adminMode) {
            const currentDate = new Date();
            query.startDate = { $gte: currentDate };
        }
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$and = [{ title: searchRegex }];
        }
        if (filter && (filter === null || filter === void 0 ? void 0 : filter.startDate)) {
            const startDate = new Date(filter.startDate);
            console.log(startDate);
            query.startDate = { $gte: startDate };
        }
        const skip = (page - 1) * limit;
        const webinars = await WebinarModel_1.WebinarModel
            .find(query)
            .populate('hosts', ["email", "name"])
            .populate("createdBy", ["email", "name"])
            .skip(skip)
            .limit(limit)
            .sort(sort || { startDate: -1 });
        const count = await WebinarModel_1.WebinarModel.countDocuments(query);
        return (0, helpers_1.convertToPagination)(webinars, count, paginationData.limit, paginationData.offset);
    }
    catch (error) {
        throw new Error(`Error: retrieving webinar: ${error.message}`);
    }
};
exports.getAllWebinars = getAllWebinars;
