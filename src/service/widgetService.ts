// services/widgetService.ts
import WidgetModel, { IWidget } from '@/models/Widgets';
import { PaginatedList, ListOptions } from '@/types/custom';
import { convertToPagination, getPaginationParams } from '@/utils/helpers';
import mongoose from 'mongoose';

const createWidget = async (widgetData: Partial<IWidget>): Promise<IWidget> => {
  try {
    const newWidget = new WidgetModel(widgetData);
    return await newWidget.save();
  } catch (error: any) {
    throw new Error(`Error: creating widget: ${error.message}`);
  }
};

const getAllWidgets = async (options: ListOptions): Promise<PaginatedList<IWidget>> => {
  try {
    const { limit = 10, page = 1, filter, search } = options;
    const query: any = {};

    const paginationData = getPaginationParams(limit, page);
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ type: searchRegex }];
    }

    const skip = (page - 1) * limit;
    const widgets = await WidgetModel.find(query).skip(skip).limit(limit);
    const count = await WidgetModel.countDocuments(query);
    return convertToPagination(widgets, count, paginationData.limit, paginationData.offset);
  } catch (error: any) {
    throw new Error(`Error: retrieving widgets: ${error.message}`);
  }
};

const getWidgetById = async (widgetId: string): Promise<IWidget | null> => {
  try {
     if (mongoose.Types.ObjectId.isValid(widgetId)) {
      return await WidgetModel.findById(widgetId);
    } else {
      return await WidgetModel.findOne({ code: widgetId });
    }
  } catch (error: any) {
    throw new Error(`Error: retrieving widget: ${error.message}`);
  }
};

const updateWidgetById = async (widgetId: string, updateData: Partial<IWidget>): Promise<IWidget | null> => {
  try {
    return await WidgetModel.findByIdAndUpdate(widgetId, updateData, { new: true });
  } catch (error: any) {
    throw new Error(`Error: updating widget: ${error.message}`);
  }
};

const deleteWidgetById = async (widgetId: string): Promise<void> => {
  try {
    await WidgetModel.findByIdAndDelete(widgetId);
  } catch (error: any) {
    throw new Error(`Error: deleting widget: ${error.message}`);
  }
};
const getWidgetTypes = async (): Promise<string[]> => {
    try {
      const widgetTypes = await WidgetModel.distinct('type');
      return widgetTypes;
    } catch (error: any) {
      throw new Error(`Error: retrieving widget types: ${error.message}`);
    }
  }

export {
  createWidget,
  getAllWidgets,
  getWidgetById,
  updateWidgetById,
  deleteWidgetById,
  getWidgetTypes
};
