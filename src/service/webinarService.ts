import { CreateWebinarType } from '@/entity-schema/webinar';
import { Webinar, WebinarModel } from '@/models/WebinarModel';
import { ListOptions, PaginatedList } from '@/types/custom';
import { convertToPagination, getPaginationParams } from '@/utils/helpers';
import {Types, ObjectId} from 'mongoose'



// Function to create a new webinar
export async function createWebinar(data: CreateWebinarType): Promise<Webinar> {
  try {
    const webinar = await WebinarModel.create(data);
    return webinar.toObject();
  } catch (error: any) {
    throw new Error(`Failed to create webinar: ${error.message}`);
  }
}

// Function to get a webinar by ID
export async function getWebinarById(webinarId: string): Promise<Webinar | null> {
  try {
    const query = Types.ObjectId.isValid(webinarId)
    ?  { _id: webinarId }
    : { slug: webinarId };
    const webinar = await WebinarModel
                  .findOne(query)
                  .populate('hosts', ["email", "name"])
                  .populate("createdBy", ["email", "name"]);
    return webinar ? webinar.toObject() : null;
  } catch (error: any) {
    throw new Error(`Failed to get webinar: ${error.message}`);
  }
}
// Function to get a webinar by ID
export async function getWebinarBySlug(slug: string): Promise<Webinar | null> {
  try {
    const webinar = await WebinarModel
    .findOne({slug})
    .populate('hosts', ["email", "name"])
    .populate("createdBy", ["email", "name"]);
    return webinar ? webinar.toObject() : null;
  } catch (error: any) {
    throw new Error(`Failed to get webinar: ${error.message}`);
  }
}

// Function to update a webinar by ID
export async function updateWebinarById(webinarId: string, updateData: Partial<Webinar>): Promise<Webinar | null> {
  try {
    const webinar = await WebinarModel
                    .findByIdAndUpdate(webinarId, updateData, { new: true })
                    .populate('hosts', ["email", "name"])
                    .populate("createdBy", ["email", "name"]);
    return webinar ? webinar.toObject() : null;
  } catch (error: any) {
    throw new Error(`Failed to update webinar: ${error.message}`);
  }
}

// Function to delete a webinar by ID
export async function deleteWebinarById(webinarId: string): Promise<void> {
  try {
    await WebinarModel.findByIdAndDelete(webinarId);
  } catch (error: any) {
    throw new Error(`Failed to delete webinar: ${error.message}`);
  }
}

export async function addHosts(webinarId: string, hosts: string[]): Promise<Webinar | null> {
  try {
    // Find the webinar by ID
    const webinar = await WebinarModel.findById(webinarId);
    
    if (!webinar) {
      throw new Error('Webinar not found');
    }

    // Convert hosts array to Set to ensure uniqueness
    const uniqueHosts = new Set(hosts.map(h => new Types.ObjectId(h)));

    // Filter out host IDs that are already present in the webinar.hosts array
    const newHosts = [...uniqueHosts].filter(host => !webinar.hosts.includes(host));

    // Add new hosts to the webinar
    webinar.hosts.push(...newHosts);

    // Save the updated webinar
    await webinar.save();

    // Return the updated webinar
    return webinar.toObject();
  } catch (error: any) {
    throw new Error(`Failed to add hosts to webinar: ${error.message}`);
  }
}


export const getAllWebinars = async (options: ListOptions, adminMode= false): Promise<PaginatedList<Webinar>> => {
  try {
      const { limit = 10, page = 1, search, filter, sort } = options;
      const query: any = {}; 
      const paginationData = getPaginationParams(limit, page);
      if(adminMode){
        const currentDate = new Date();
        // query.isActive = true,
        query.startDate = {$gte: currentDate};
      }

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$and = [{ title: searchRegex }];
      }
      if (filter && filter?.startDate) {
        const startDate = new Date(filter.startDate);
        console.log(startDate)
        query.startDate = { $gte: startDate };
      }

      const skip = (page - 1) * limit;
      const webinars = await WebinarModel
                    .find(query)
                    .populate('hosts', ["email", "name"])
                    .populate("createdBy", ["email", "name"])
                    .skip(skip)
                    .limit(limit)
                    .sort(sort || { startDate: -1 });
      
      const count = await WebinarModel.countDocuments(query);
      return convertToPagination(webinars, count, paginationData.limit, paginationData.offset);
  } catch (error: any) {
      throw new Error(`Error: retrieving webinar: ${error.message}`);
  }
};

