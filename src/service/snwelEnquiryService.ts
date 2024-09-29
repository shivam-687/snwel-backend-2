// src/services/enquiryService.ts

import SnwelEnquiryModel, { ISnwelEnquiry as Enquiry } from '@/models/SnwelEnquiry';
import { ListOptions, PaginatedList } from '@/types/custom';
import { convertSortOrder, getPaginationParams } from '@/utils/helpers';
import { Parser } from 'json2csv';
import { Types } from 'mongoose';
// import { sendEnquiryConfirmation } from './notificationService';

// Function to create a new enquiry
export async function createEnquiry(data: Enquiry): Promise<Enquiry> {
  try {
    const enquiry = await SnwelEnquiryModel.create(data);

    // try {
    //   // Sending enquiry confirmation
    //   await sendEnquiryConfirmation(enquiry, {
    //     email: enquiry.businessEmail,
    //     phone: enquiry.mobileNo,
    //   });
    // } catch (error) {
    //   console.error("Failed to send confirmation to", enquiry.businessEmail, error);
    // }

    return enquiry.toObject();
  } catch (error: any) {
    console.error(`Failed to create enquiry: ${error.message}`, error);
    throw new Error(`Failed to create enquiry: ${error.message}`);
  }
}

// Function to get an enquiry by ID
export async function getEnquiryById(enquiryId: string): Promise<Enquiry | null> {
  try {
    const query = Types.ObjectId.isValid(enquiryId)
      ? { _id: enquiryId }
      : { enquiryId: enquiryId };
    const enquiry = await SnwelEnquiryModel.findOne(query);
    return enquiry ? enquiry.toObject() : null;
  } catch (error: any) {
    throw new Error(`Failed to get enquiry: ${error.message}`);
  }
}

// Function to update an enquiry by ID
export async function updateEnquiryById(enquiryId: string, updateData: Partial<Enquiry>): Promise<Enquiry | null> {
  try {
    const enquiry = await SnwelEnquiryModel.findByIdAndUpdate(enquiryId, updateData, { new: true });
    return enquiry ? enquiry.toObject() : null;
  } catch (error: any) {
    throw new Error(`Failed to update enquiry: ${error.message}`);
  }
}

// Function to delete an enquiry by ID
export async function deleteEnquiryById(enquiryId: string): Promise<void> {
  try {
    await SnwelEnquiryModel.findByIdAndDelete(enquiryId);
  } catch (error: any) {
    throw new Error(`Failed to delete enquiry: ${error.message}`);
  }
}

// Function to get all enquiries with pagination
export const getAllEnquiries = async (options: ListOptions): Promise<any> => {
  try {
    const { limit = 10, page = 1, search, filter, sort, startDate, endDate } = options;
    const query: any = {};

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

    const enquiries = await SnwelEnquiryModel.paginate(
      query,
      {
        page,
        limit,
        sort: sort ? convertSortOrder(sort) : { createdAt: -1 },
      }
    );

    return enquiries;
  } catch (error: any) {
    throw new Error(`Error retrieving enquiries: ${error.message}`);
  }
};

// Function to export enquiries to CSV
export const exportEnquiries = async (options: ListOptions): Promise<string> => {
  try {
    const enquiries = await getAllEnquiries(options);
    const enquiryData = enquiries.docs; // Extract the documents from the paginated result

    // Convert the data to CSV format
    const parser = new Parser();
    const csv = parser.parse(enquiryData);

    return csv; // You can return the CSV string or save it to a file
  } catch (error: any) {
    throw new Error(`Error exporting enquiries: ${error.message}`);
  }
};
