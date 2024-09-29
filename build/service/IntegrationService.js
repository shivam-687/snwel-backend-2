"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntegrationTypes = exports.deleteIntegrationById = exports.updateIntegrationById = exports.getIntegrationById = exports.getAllIntegrations = exports.createIntegration = void 0;
// services/integrationService.ts
const IntegrationModel_1 = __importDefault(require("../models/IntegrationModel"));
const helpers_1 = require("../utils/helpers");
const mongoose_1 = __importDefault(require("mongoose"));
const createIntegration = async (integrationData) => {
    try {
        const newIntegration = new IntegrationModel_1.default(integrationData);
        return await newIntegration.save();
    }
    catch (error) {
        throw new Error(`Error: creating integration: ${error.message}`);
    }
};
exports.createIntegration = createIntegration;
const getAllIntegrations = async (options) => {
    try {
        const { limit = 100, page = 1, filter, search } = options;
        const query = {};
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ serviceName: searchRegex }];
        }
        const skip = (page - 1) * limit;
        const integrations = await IntegrationModel_1.default.find(query).skip(skip).limit(limit);
        const count = await IntegrationModel_1.default.countDocuments(query);
        return (0, helpers_1.convertToPagination)(integrations, count, paginationData.limit, paginationData.offset);
    }
    catch (error) {
        throw new Error(`Error: retrieving integrations: ${error.message}`);
    }
};
exports.getAllIntegrations = getAllIntegrations;
const getIntegrationById = async (integrationId) => {
    try {
        if (mongoose_1.default.Types.ObjectId.isValid(integrationId)) {
            return await IntegrationModel_1.default.findById(integrationId);
        }
        else {
            return await IntegrationModel_1.default.findOne({ serviceName: integrationId });
        }
    }
    catch (error) {
        throw new Error(`Error: retrieving integration: ${error.message}`);
    }
};
exports.getIntegrationById = getIntegrationById;
const updateIntegrationById = async (integrationId, updateData) => {
    try {
        return await IntegrationModel_1.default.findByIdAndUpdate(integrationId, updateData, { new: true });
    }
    catch (error) {
        throw new Error(`Error: updating integration: ${error.message}`);
    }
};
exports.updateIntegrationById = updateIntegrationById;
const deleteIntegrationById = async (integrationId) => {
    try {
        await IntegrationModel_1.default.findByIdAndDelete(integrationId);
    }
    catch (error) {
        throw new Error(`Error: deleting integration: ${error.message}`);
    }
};
exports.deleteIntegrationById = deleteIntegrationById;
const getIntegrationTypes = async () => {
    try {
        const integrationTypes = await IntegrationModel_1.default.distinct('supportedActions');
        return integrationTypes;
    }
    catch (error) {
        throw new Error(`Error: retrieving integration types: ${error.message}`);
    }
};
exports.getIntegrationTypes = getIntegrationTypes;
