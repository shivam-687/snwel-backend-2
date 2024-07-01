// controllers/widgetController.ts
import { Request, Response } from 'express';
import {
  createWidget,
  getAllWidgets,
  getWidgetById,
  updateWidgetById,
  deleteWidgetById,
  getWidgetTypes
} from '@/service/widgetService';
import { successResponse, errorResponse } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';

const createWidgetController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const widgetData = req.body;
  const newWidget = await createWidget(widgetData);
  successResponse(newWidget, res, { message: 'Widget created successfully!' });
});

const getAllWidgetsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const options = { ...req.query };
  const widgets = await getAllWidgets(options);
  successResponse(widgets, res, { message: 'Widgets fetched successfully!' });
});

const getWidgetByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const widget = await getWidgetById(id);
  if (!widget) {
    return errorResponse('Widget not found', res);
  }
  successResponse(widget, res, { message: 'Widget fetched successfully!' });
});

const updateWidgetByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedWidget = await updateWidgetById(id, updateData);
  if (!updatedWidget) {
    return errorResponse('Widget not found', res);
  }
  successResponse(updatedWidget, res, { message: 'Widget updated successfully!' });
});

const deleteWidgetByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await deleteWidgetById(id);
  successResponse(null, res, { message: 'Widget deleted successfully!' });
});

const getWidgetTypesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const widgetTypes = await getWidgetTypes();
    successResponse(widgetTypes, res, { message: 'Widget types fetched successfully!' });
  });

export {
  createWidgetController,
  getAllWidgetsController,
  getWidgetByIdController,
  updateWidgetByIdController,
  deleteWidgetByIdController,
  getWidgetTypesController
};
