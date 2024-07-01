"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWidgetTypesController = exports.deleteWidgetByIdController = exports.updateWidgetByIdController = exports.getWidgetByIdController = exports.getAllWidgetsController = exports.createWidgetController = void 0;
const widgetService_1 = require("../service/widgetService");
const appResponse_1 = require("../utils/helpers/appResponse");
const catchAsync_1 = require("../utils/helpers/catchAsync");
const createWidgetController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const widgetData = req.body;
    const newWidget = await (0, widgetService_1.createWidget)(widgetData);
    (0, appResponse_1.successResponse)(newWidget, res, { message: 'Widget created successfully!' });
});
exports.createWidgetController = createWidgetController;
const getAllWidgetsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = { ...req.query };
    const widgets = await (0, widgetService_1.getAllWidgets)(options);
    (0, appResponse_1.successResponse)(widgets, res, { message: 'Widgets fetched successfully!' });
});
exports.getAllWidgetsController = getAllWidgetsController;
const getWidgetByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const widget = await (0, widgetService_1.getWidgetById)(id);
    if (!widget) {
        return (0, appResponse_1.errorResponse)('Widget not found', res);
    }
    (0, appResponse_1.successResponse)(widget, res, { message: 'Widget fetched successfully!' });
});
exports.getWidgetByIdController = getWidgetByIdController;
const updateWidgetByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const updatedWidget = await (0, widgetService_1.updateWidgetById)(id, updateData);
    if (!updatedWidget) {
        return (0, appResponse_1.errorResponse)('Widget not found', res);
    }
    (0, appResponse_1.successResponse)(updatedWidget, res, { message: 'Widget updated successfully!' });
});
exports.updateWidgetByIdController = updateWidgetByIdController;
const deleteWidgetByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await (0, widgetService_1.deleteWidgetById)(id);
    (0, appResponse_1.successResponse)(null, res, { message: 'Widget deleted successfully!' });
});
exports.deleteWidgetByIdController = deleteWidgetByIdController;
const getWidgetTypesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const widgetTypes = await (0, widgetService_1.getWidgetTypes)();
    (0, appResponse_1.successResponse)(widgetTypes, res, { message: 'Widget types fetched successfully!' });
});
exports.getWidgetTypesController = getWidgetTypesController;
