"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnquiryByEmailAndType = exports.getEnquiryTypes = exports.deleteEnquiryById = exports.updateEnquiryById = exports.getEnquiryById = exports.getAllEnquiries = exports.createEnquiry = void 0;
// services/enquiryService.ts
const EnquiryModel_1 = __importDefault(require("../models/EnquiryModel"));
const helpers_1 = require("../utils/helpers");
const mongoose_1 = __importDefault(require("mongoose"));
const createEnquiry = async (enquiryData) => {
    try {
        // Check if the type is 'webinar' and convert webinarId to ObjectId
        if (enquiryData.type === 'webinar' && enquiryData.extraInfo && enquiryData.extraInfo.webinarId) {
            enquiryData.extraInfo.webinarId = new mongoose_1.default.Types.ObjectId(enquiryData.extraInfo.webinarId);
        }
        const newEnquiry = new EnquiryModel_1.default(enquiryData);
        return await newEnquiry.save();
    }
    catch (error) {
        throw new Error(`Error creating enquiry: ${error.message}`);
    }
};
exports.createEnquiry = createEnquiry;
async function getAllEnquiries(options) {
    try {
        const { limit = 10, page = 1, search } = options;
        const query = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ type: searchRegex }, { 'extraInfo.webinarId': searchRegex }];
        }
        if (options?.filter?.type) {
            query.type = options?.filter?.type;
        }
        const skip = (page - 1) * limit;
        // Start with the basic pipeline
        const pipeline = [
            { $match: query },
            { $skip: skip },
            { $limit: limit }
        ];
        // Check if there are any webinar enquiries in the query
        if (options?.filter?.type === 'webinar' || search?.toLowerCase().includes('webinar')) {
            pipeline.push({
                $lookup: {
                    from: 'webinars',
                    localField: 'extraInfo.webinarId',
                    foreignField: '_id',
                    as: 'extraInfo.webinar'
                }
            }, {
                $unwind: {
                    path: '$extraInfo.webinar',
                    preserveNullAndEmptyArrays: true
                }
            });
        }
        const enquiries = await EnquiryModel_1.default.aggregate(pipeline);
        const count = await EnquiryModel_1.default.countDocuments(query);
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        return (0, helpers_1.convertToPagination)(enquiries, count, paginationData.limit, paginationData.offset);
    }
    catch (error) {
        throw new Error(`Error: retrieving enquiries: ${error.message}`);
    }
}
exports.getAllEnquiries = getAllEnquiries;
const getEnquiryById = async (enquiryId) => {
    try {
        return await EnquiryModel_1.default.findById(enquiryId);
    }
    catch (error) {
        throw new Error(`Error retrieving enquiry: ${error.message}`);
    }
};
exports.getEnquiryById = getEnquiryById;
const getEnquiryByEmailAndType = async (email, type) => {
    try {
        return await EnquiryModel_1.default.findOne({ email, type });
    }
    catch (error) {
        throw new Error(`Error retrieving enquiry: ${error.message}`);
    }
};
exports.getEnquiryByEmailAndType = getEnquiryByEmailAndType;
const updateEnquiryById = async (enquiryId, updateData) => {
    try {
        return await EnquiryModel_1.default.findByIdAndUpdate(enquiryId, updateData, { new: true });
    }
    catch (error) {
        throw new Error(`Error updating enquiry: ${error.message}`);
    }
};
exports.updateEnquiryById = updateEnquiryById;
const deleteEnquiryById = async (enquiryId) => {
    try {
        await EnquiryModel_1.default.findByIdAndDelete(enquiryId);
    }
    catch (error) {
        throw new Error(`Error deleting enquiry: ${error.message}`);
    }
};
exports.deleteEnquiryById = deleteEnquiryById;
const getEnquiryTypes = async () => {
    try {
        const enquiryTypes = await EnquiryModel_1.default.distinct('type');
        return enquiryTypes;
    }
    catch (error) {
        throw new Error(`Error retrieving enquiry types: ${error.message}`);
    }
};
exports.getEnquiryTypes = getEnquiryTypes;
