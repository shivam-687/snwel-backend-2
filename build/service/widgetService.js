"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWidgetTypes = exports.deleteWidgetById = exports.updateWidgetById = exports.getWidgetById = exports.getAllWidgets = exports.createWidget = void 0;
const Widgets_1 = __importDefault(require("../models/Widgets"));
const helpers_1 = require("../utils/helpers");
const mongoose_1 = __importDefault(require("mongoose"));
const createWidget = async (widgetData) => {
    try {
        const newWidget = new Widgets_1.default(widgetData);
        return await newWidget.save();
    }
    catch (error) {
        throw new Error(`Error: creating widget: ${error.message}`);
    }
};
exports.createWidget = createWidget;
const getAllWidgets = async (options) => {
    try {
        const { limit = 10, page = 1, filter, search } = options;
        const query = {};
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ type: searchRegex }];
        }
        const skip = (page - 1) * limit;
        const widgets = await Widgets_1.default.find(query).skip(skip).limit(limit);
        const count = await Widgets_1.default.countDocuments(query);
        return (0, helpers_1.convertToPagination)(widgets, count, paginationData.limit, paginationData.offset);
    }
    catch (error) {
        throw new Error(`Error: retrieving widgets: ${error.message}`);
    }
};
exports.getAllWidgets = getAllWidgets;
const getWidgetById = async (widgetId) => {
    try {
        if (mongoose_1.default.Types.ObjectId.isValid(widgetId)) {
            return await Widgets_1.default.findById(widgetId);
        }
        else {
            return await Widgets_1.default.findOne({ code: widgetId });
        }
    }
    catch (error) {
        throw new Error(`Error: retrieving widget: ${error.message}`);
    }
};
exports.getWidgetById = getWidgetById;
const updateWidgetById = async (widgetId, updateData) => {
    try {
        return await Widgets_1.default.findByIdAndUpdate(widgetId, updateData, { new: true });
    }
    catch (error) {
        throw new Error(`Error: updating widget: ${error.message}`);
    }
};
exports.updateWidgetById = updateWidgetById;
const deleteWidgetById = async (widgetId) => {
    try {
        await Widgets_1.default.findByIdAndDelete(widgetId);
    }
    catch (error) {
        throw new Error(`Error: deleting widget: ${error.message}`);
    }
};
exports.deleteWidgetById = deleteWidgetById;
const getWidgetTypes = async () => {
    try {
        const widgetTypes = await Widgets_1.default.distinct('type');
        return widgetTypes;
    }
    catch (error) {
        throw new Error(`Error: retrieving widget types: ${error.message}`);
    }
};
exports.getWidgetTypes = getWidgetTypes;
