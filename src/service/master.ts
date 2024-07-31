import MasterModel, { IMaster } from '@/models/MasterModel';
import { PaginatedList, ListOptions } from '@/types/custom';
import { convertToPagination, getPaginationParams } from '@/utils/helpers';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const createMasterItem = async (data: Partial<IMaster>): Promise<IMaster> => {
  try {
    const newMasterItem = new MasterModel(data);
    return await newMasterItem.save();
  } catch (error: any) {
    throw new Error(`Error: creating master item: ${error.message}`);
  }
};

const getAllMasterItems = async (options: ListOptions): Promise<PaginatedList<IMaster>> => {
  try {
    const { limit = 10, page = 1, search, filter } = options;
    let query: any = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ name: searchRegex }, { code: searchRegex }];
    }
    if(filter){
        query = {...query, ...filter}
    }
    console.log({query})

    const skip = (page - 1) * limit;

    const masterItems = await MasterModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({createdAt: -1, sequence: -1})

    const count = await MasterModel.countDocuments(query);

    const paginationData = getPaginationParams(limit, page);
    return convertToPagination(masterItems, count, paginationData.limit, paginationData.offset);
  } catch (error: any) {
    throw new Error(`Error: retrieving master items: ${error.message}`);
  }
};

const getMasterItemByCode = async (code: string): Promise<IMaster | null> => {
  try {
    return await MasterModel.findOne({ code });
  } catch (error: any) {
    throw new Error(`Error: retrieving master item: ${error.message}`);
  }
};

const updateMasterItemByCode = async (code: string, updateData: Partial<IMaster>): Promise<IMaster | null> => {
  try {
    return await MasterModel.findOneAndUpdate({ _id: new ObjectId(code) }, updateData, { new: true });
  } catch (error: any) {
    throw new Error(`Error: updating master item: ${error.message}`);
  }
};

const getMasterItem = async (identifier: string): Promise<IMaster | null> => {
  try {
    // Check if the identifier is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      return await MasterModel.findById(identifier);
    } else {
      // Otherwise, assume it's a code and find by code
      return await MasterModel.findOne({ code: identifier });
    }
  } catch (error: any) {
    throw new Error(`Error: retrieving master item: ${error.message}`);
  }
};

const deleteMasterItemByCode = async (identifier: string): Promise<void> => {
  try {
    let query: any = {};
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query["_id"] = new ObjectId(identifier);
    } else {
     query["code"] = identifier;
    }
    console.log(query)
    await MasterModel.findOneAndDelete(query);
  } catch (error: any) {
    throw new Error(`Error: deleting master item: ${error.message}`);
  }
};

export {
  createMasterItem,
  getAllMasterItems,
  getMasterItemByCode,
  updateMasterItemByCode,
  deleteMasterItemByCode,
  getMasterItem
};
