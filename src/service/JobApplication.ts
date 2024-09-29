// src/services/jobApplicationService.ts

import JobApplicationModel, {IJobApplication as JobApplication} from '@/models/JobApplicationModel';
import { ListOptions, PaginatedList } from '@/types/custom';
import { convertSortOrder, convertToPagination, getPaginationParams } from '@/utils/helpers';
import { Types } from 'mongoose';
import { Parser } from 'json2csv';
import { sendJobApplyConfirmation } from './notificationService';

// Function to create a new job application
export async function createJobApplication(data: JobApplication): Promise<JobApplication> {
  try {
    const jobApplication = await JobApplicationModel.create(data);

    try {
      // Ensure populate is awaited
      await jobApplication.populate("jobId");

      // Sending job application confirmation
      await sendJobApplyConfirmation(jobApplication, {
        email: jobApplication.email,
        phone: jobApplication.phone
      });
    } catch (error) {
      console.error("Failed to send mail to", jobApplication.email, error); // Log error details
    }

    return jobApplication.toObject();
  } catch (error: any) {
    // Better error handling with logging the full error
    console.error(`Failed to create job application: ${error.message}`, error);
    throw new Error(`Failed to create job application: ${error.message}`);
  }
}


// Function to get a job application by ID
export async function getJobApplicationById(jobApplicationId: string): Promise<JobApplication | null> {
  try {
    const query = Types.ObjectId.isValid(jobApplicationId)
      ? { _id: jobApplicationId }
      : { jobId: jobApplicationId };
    const jobApplication = await JobApplicationModel.findOne(query);
    return jobApplication ? jobApplication.toObject() : null;
  } catch (error: any) {
    throw new Error(`Failed to get job application: ${error.message}`);
  }
}

// Function to update a job application by ID
export async function updateJobApplicationById(jobApplicationId: string, updateData: Partial<JobApplication>): Promise<JobApplication | null> {
  try {
    const jobApplication = await JobApplicationModel.findByIdAndUpdate(jobApplicationId, updateData, { new: true });
    return jobApplication ? jobApplication.toObject() : null;
  } catch (error: any) {
    throw new Error(`Failed to update job application: ${error.message}`);
  }
}

// Function to delete a job application by ID
export async function deleteJobApplicationById(jobApplicationId: string): Promise<void> {
  try {
    await JobApplicationModel.findByIdAndDelete(jobApplicationId);
  } catch (error: any) {
    throw new Error(`Failed to delete job application: ${error.message}`);
  }
}

// Function to get all job applications with pagination
export const getAllJobApplications = async (options: ListOptions) => {
    try {
      const { limit = 10, page = 1, search, filter, sort, startDate, endDate } = options;
      const query: any = {};
  
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [{ applicantName: searchRegex }, { email: searchRegex }];
      }
  
      if (filter && filter.status) {
        query.status = filter.status;
      }
  
      if (startDate || endDate) {
        query.appliedDate = {};
        if (startDate) {
          query.appliedDate.$gte = new Date(startDate);
        }
        if (endDate) {
          query.appliedDate.$lte = new Date(endDate);
        }
      }
  
      const jobApplications = await JobApplicationModel.paginate(
        query, 
        {
          populate: {
            path: 'jobId',
            select: ['title', 'slug', '_id', 'companyName']
          },
          page,
          limit,
          sort: sort ? convertSortOrder(sort) : { appliedDate: -1 }
        }
      )
  
      return jobApplications
    } catch (error: any) {
      throw new Error(`Error retrieving job applications: ${error.message}`);
    }
  };



  export const exportJobApplications = async (options: ListOptions): Promise<string> => {
    try {
      const jobApplications = await getAllJobApplications(options);
      const jobAppsData = jobApplications.docs; // Extract the documents from the paginated result
  
      // Convert the data to CSV format
      const parser = new Parser();
      const csv = parser.parse(jobAppsData);
  
      // You can return the CSV string or save it to a file depending on your needs
      return csv;
    } catch (error: any) {
      throw new Error(`Error exporting job applications: ${error.message}`);
    }
  };
  