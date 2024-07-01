// services/enquiryService.ts
import EnquiryModel, { Enquiry as IEnquiry } from '@/models/EnquiryModel';
import { PaginatedList, ListOptions } from '@/types/custom';
import { convertToPagination, getPaginationParams } from '@/utils/helpers';
import mongoose from 'mongoose';

const createEnquiry = async (enquiryData: Partial<IEnquiry>): Promise<IEnquiry> => {
  try {
    // Check if the type is 'webinar' and convert webinarId to ObjectId
    if (enquiryData.type === 'webinar' && enquiryData.extraInfo && enquiryData.extraInfo.webinarId) {
      enquiryData.extraInfo.webinarId = new mongoose.Types.ObjectId(enquiryData.extraInfo.webinarId);
    }

    const newEnquiry = new EnquiryModel(enquiryData);
    return await newEnquiry.save();
  } catch (error: any) {
    throw new Error(`Error creating enquiry: ${error.message}`);
  }
};

async function getAllEnquiries(options: ListOptions): Promise<PaginatedList<IEnquiry>> {
  try {
      
      const { limit = 10, page = 1, search } = options;
      const query: any = {};

      if (search) {
          const searchRegex = new RegExp(search, 'i');
          query.$or = [{ type: searchRegex }, { 'extraInfo.webinarId': searchRegex }];
      }
      if(options?.filter?.type){
        query.type = options?.filter?.type
      }

      const skip = (page - 1) * limit;

      // Start with the basic pipeline
      const pipeline: any[] = [
          { $match: query },
          { $skip: skip },
          { $limit: limit }
      ];
      console.log({options})
      // Check if there are any webinar enquiries in the query
      if (options?.filter?.type === 'webinar' || search?.toLowerCase().includes('webinar')) {
          pipeline.push(
              {
                  $lookup: {
                      from: 'webinars',
                      localField: 'extraInfo.webinarId',
                      foreignField: '_id',
                      as: 'extraInfo.webinar'
                  }
              },
              {
                  $unwind: {
                      path: '$extraInfo.webinar',
                      preserveNullAndEmptyArrays: true
                  }
              }
          );
      }

      const enquiries = await EnquiryModel.aggregate(pipeline);
      const count = await EnquiryModel.countDocuments(query);

      const paginationData = getPaginationParams(limit, page);
      return convertToPagination(enquiries, count, paginationData.limit, paginationData.offset);
  } catch (error: any) {
      throw new Error(`Error: retrieving enquiries: ${error.message}`);
  }
}

const getEnquiryById = async (enquiryId: string): Promise<IEnquiry | null> => {
  try {
    return await EnquiryModel.findById(enquiryId);
  } catch (error: any) {
    throw new Error(`Error retrieving enquiry: ${error.message}`);
  }
};

const getEnquiryByEmailAndType = async (email: string, type: string): Promise<IEnquiry | null> => {
  try {
    return await EnquiryModel.findOne({email, type});
  } catch (error: any) {
    throw new Error(`Error retrieving enquiry: ${error.message}`);
  }
};

const updateEnquiryById = async (enquiryId: string, updateData: Partial<IEnquiry>): Promise<IEnquiry | null> => {
  try {
    return await EnquiryModel.findByIdAndUpdate(enquiryId, updateData, { new: true });
  } catch (error: any) {
    throw new Error(`Error updating enquiry: ${error.message}`);
  }
};

const deleteEnquiryById = async (enquiryId: string): Promise<void> => {
  try {
    await EnquiryModel.findByIdAndDelete(enquiryId);
  } catch (error: any) {
    throw new Error(`Error deleting enquiry: ${error.message}`);
  }
};

const getEnquiryTypes = async (): Promise<string[]> => {
  try {
    const enquiryTypes = await EnquiryModel.distinct('type');
    return enquiryTypes;
  } catch (error: any) {
    throw new Error(`Error retrieving enquiry types: ${error.message}`);
  }
};

export {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryById,
  deleteEnquiryById,
  getEnquiryTypes,
  getEnquiryByEmailAndType
};
