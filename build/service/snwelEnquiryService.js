"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportEnquiries = exports.getAllEnquiries = exports.deleteEnquiryById = exports.updateEnquiryById = exports.getEnquiryById = exports.createEnquiry = void 0;
const SnwelEnquiry_1 = __importDefault(require("../models/SnwelEnquiry"));
const helpers_1 = require("../utils/helpers");
const json2csv_1 = require("json2csv");
const mongoose_1 = require("mongoose");
async function createEnquiry(data) {
    try {
        const enquiry = await SnwelEnquiry_1.default.create(data);
        return enquiry.toObject();
    }
    catch (error) {
        console.error(`Failed to create enquiry: ${error.message}`, error);
        throw new Error(`Failed to create enquiry: ${error.message}`);
    }
}
exports.createEnquiry = createEnquiry;
async function getEnquiryById(enquiryId) {
    try {
        const query = mongoose_1.Types.ObjectId.isValid(enquiryId)
            ? { _id: enquiryId }
            : { enquiryId: enquiryId };
        const enquiry = await SnwelEnquiry_1.default.findOne(query);
        return enquiry ? enquiry.toObject() : null;
    }
    catch (error) {
        throw new Error(`Failed to get enquiry: ${error.message}`);
    }
}
exports.getEnquiryById = getEnquiryById;
async function updateEnquiryById(enquiryId, updateData) {
    try {
        const enquiry = await SnwelEnquiry_1.default.findByIdAndUpdate(enquiryId, updateData, { new: true });
        return enquiry ? enquiry.toObject() : null;
    }
    catch (error) {
        throw new Error(`Failed to update enquiry: ${error.message}`);
    }
}
exports.updateEnquiryById = updateEnquiryById;
async function deleteEnquiryById(enquiryId) {
    try {
        await SnwelEnquiry_1.default.findByIdAndDelete(enquiryId);
    }
    catch (error) {
        throw new Error(`Failed to delete enquiry: ${error.message}`);
    }
}
exports.deleteEnquiryById = deleteEnquiryById;
const getAllEnquiries = async (options) => {
    try {
        const { limit = 10, page = 1, search, filter, sort, startDate, endDate } = options;
        const query = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ name: searchRegex }, { businessEmail: searchRegex }, { company: searchRegex }];
        }
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }
        const enquiries = await SnwelEnquiry_1.default.paginate(query, {
            page,
            limit,
            sort: sort ? (0, helpers_1.convertSortOrder)(sort) : { createdAt: -1 },
        });
        return enquiries;
    }
    catch (error) {
        throw new Error(`Error retrieving enquiries: ${error.message}`);
    }
};
exports.getAllEnquiries = getAllEnquiries;
const exportEnquiries = async (options) => {
    try {
        const enquiries = await (0, exports.getAllEnquiries)(options);
        const enquiryData = enquiries.docs;
        const parser = new json2csv_1.Parser();
        const csv = parser.parse(enquiryData);
        return csv;
    }
    catch (error) {
        throw new Error(`Error exporting enquiries: ${error.message}`);
    }
};
exports.exportEnquiries = exportEnquiries;
