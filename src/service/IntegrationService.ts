// services/integrationService.ts
import IntegrationModel, { IIntegration } from '@/models/IntegrationModel';
import { PaginatedList, ListOptions } from '@/types/custom';
import { convertToPagination, getPaginationParams } from '@/utils/helpers';
import mongoose from 'mongoose';

const createIntegration = async (integrationData: Partial<IIntegration>): Promise<IIntegration> => {
  try {
    const newIntegration = new IntegrationModel(integrationData);
    return await newIntegration.save();
  } catch (error: any) {
    throw new Error(`Error: creating integration: ${error.message}`);
  }
};

const getAllIntegrations = async (options: ListOptions): Promise<PaginatedList<IIntegration>> => {
  try {
    const { limit = 100, page = 1, filter, search } = options;
    const query: any = {};

    const paginationData = getPaginationParams(limit, page);
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ serviceName: searchRegex }];
    }

    const skip = (page - 1) * limit;
    const integrations = await IntegrationModel.find(query).skip(skip).limit(limit);
    const count = await IntegrationModel.countDocuments(query);
    return convertToPagination(integrations, count, paginationData.limit, paginationData.offset);
  } catch (error: any) {
    throw new Error(`Error: retrieving integrations: ${error.message}`);
  }
};

const getIntegrationById = async (integrationId: string): Promise<IIntegration | null> => {
  try {
    if (mongoose.Types.ObjectId.isValid(integrationId)) {
      return await IntegrationModel.findById(integrationId);
    } else {
      return await IntegrationModel.findOne({ serviceName: integrationId });
    }
  } catch (error: any) {
    throw new Error(`Error: retrieving integration: ${error.message}`);
  }
};

const updateIntegrationById = async (integrationId: string, updateData: Partial<IIntegration>): Promise<IIntegration | null> => {
  try {
    return await IntegrationModel.findByIdAndUpdate(integrationId, updateData, { new: true });
  } catch (error: any) {
    throw new Error(`Error: updating integration: ${error.message}`);
  }
};

const deleteIntegrationById = async (integrationId: string): Promise<void> => {
  try {
    await IntegrationModel.findByIdAndDelete(integrationId);
  } catch (error: any) {
    throw new Error(`Error: deleting integration: ${error.message}`);
  }
};

const getIntegrationTypes = async (): Promise<string[]> => {
  try {
    const integrationTypes = await IntegrationModel.distinct('supportedActions');
    return integrationTypes;
  } catch (error: any) {
    throw new Error(`Error: retrieving integration types: ${error.message}`);
  }
};

export {
  createIntegration,
  getAllIntegrations,
  getIntegrationById,
  updateIntegrationById,
  deleteIntegrationById,
  getIntegrationTypes
};
