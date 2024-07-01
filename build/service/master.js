"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMasterItem = exports.deleteMasterItemByCode = exports.updateMasterItemByCode = exports.getMasterItemByCode = exports.getAllMasterItems = exports.createMasterItem = void 0;
const MasterModel_1 = __importDefault(require("../models/MasterModel"));
const helpers_1 = require("../utils/helpers");
const mongoose_1 = __importDefault(require("mongoose"));
const createMasterItem = async (data) => {
    try {
        const newMasterItem = new MasterModel_1.default(data);
        return await newMasterItem.save();
    }
    catch (error) {
        throw new Error(`Error: creating master item: ${error.message}`);
    }
};
exports.createMasterItem = createMasterItem;
const getAllMasterItems = async (options) => {
    try {
        const { limit = 10, page = 1, search, filter } = options;
        let query = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ name: searchRegex }, { code: searchRegex }];
        }
        if (filter) {
            query = { ...query, ...filter };
        }
        const skip = (page - 1) * limit;
        const masterItems = await MasterModel_1.default.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1, sequence: -1 })
            .exec();
        const count = await MasterModel_1.default.countDocuments(query);
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        return (0, helpers_1.convertToPagination)(masterItems, count, paginationData.limit, paginationData.offset);
    }
    catch (error) {
        throw new Error(`Error: retrieving master items: ${error.message}`);
    }
};
exports.getAllMasterItems = getAllMasterItems;
const getMasterItemByCode = async (code) => {
    try {
        return await MasterModel_1.default.findOne({ code });
    }
    catch (error) {
        throw new Error(`Error: retrieving master item: ${error.message}`);
    }
};
exports.getMasterItemByCode = getMasterItemByCode;
const updateMasterItemByCode = async (code, updateData) => {
    try {
        return await MasterModel_1.default.findOneAndUpdate({ code }, updateData, { new: true });
    }
    catch (error) {
        throw new Error(`Error: updating master item: ${error.message}`);
    }
};
exports.updateMasterItemByCode = updateMasterItemByCode;
const getMasterItem = async (identifier) => {
    try {
        // Check if the identifier is a valid ObjectId
        if (mongoose_1.default.Types.ObjectId.isValid(identifier)) {
            return await MasterModel_1.default.findById(identifier);
        }
        else {
            // Otherwise, assume it's a code and find by code
            return await MasterModel_1.default.findOne({ code: identifier });
        }
    }
    catch (error) {
        throw new Error(`Error: retrieving master item: ${error.message}`);
    }
};
exports.getMasterItem = getMasterItem;
const deleteMasterItemByCode = async (code) => {
    try {
        await MasterModel_1.default.findOneAndDelete({ code });
    }
    catch (error) {
        throw new Error(`Error: deleting master item: ${error.message}`);
    }
};
exports.deleteMasterItemByCode = deleteMasterItemByCode;
