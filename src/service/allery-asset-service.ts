import DigitalAssetModel, { IGalleryAsset as DigitalAsset, IGalleryAsset } from '@/models/GalleryAssets';
import { ListOptions, PaginatedList } from '@/types/custom';
import { convertSortOrder, getPaginationParams } from '@/utils/helpers';
import mongoose, { Types } from 'mongoose';


// Function to create a new digital asset
export async function createDigitalAsset(data: DigitalAsset): Promise<DigitalAsset> {
  try {
    const digitalAsset = await DigitalAssetModel.create(data);
    return digitalAsset.toObject();
  } catch (error: any) {
    throw new Error(`Failed to create digital asset: ${error.message}`);
  }
}

// Function to get a digital asset by ID
export async function getDigitalAssetById(digitalAssetId: string): Promise<DigitalAsset | null> {
  try {
    const query = Types.ObjectId.isValid(digitalAssetId)
      ? { _id: digitalAssetId }
      : { link: digitalAssetId };
    const digitalAsset = await DigitalAssetModel.findOne(query);
    return digitalAsset ? digitalAsset.toObject() : null;
  } catch (error: any) {
    throw new Error(`Failed to get digital asset: ${error.message}`);
  }
}

// Function to update a digital asset by ID
export async function updateDigitalAssetById(digitalAssetId: string, updateData: Partial<DigitalAsset>): Promise<DigitalAsset | null> {
  try {
    const digitalAsset = await DigitalAssetModel.findByIdAndUpdate(digitalAssetId, updateData, { new: true });
    return digitalAsset ? digitalAsset.toObject() : null;
  } catch (error: any) {
    throw new Error(`Failed to update digital asset: ${error.message}`);
  }
}

// Function to delete a digital asset by ID
export async function deleteDigitalAssetById(digitalAssetId: string): Promise<void> {
  try {
    await DigitalAssetModel.findByIdAndDelete(digitalAssetId);
  } catch (error: any) {
    throw new Error(`Failed to delete digital asset: ${error.message}`);
  }
}

// Function to get all digital assets with pagination
export const getAllDigitalAssets = async (options: ListOptions) => {
  try {
    const { limit = 10, page = 1, search, sort, filter } = options;
    const query: any = {};
  
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ name: searchRegex }, { description: searchRegex }, { link: searchRegex }];
    }

    if(filter && filter.linkType){
      query.linkType = filter.linkType;
    }
  
    console.log({query})
    const digitalAssets = await DigitalAssetModel.paginate(
      query,
      {
        page,
        limit,
        sort: sort ? convertSortOrder(sort) : { sequence: 1 }
      }
    );

    return digitalAssets;
  } catch (error: any) {
    throw new Error(`Error retrieving digital assets: ${error.message}`);
  }
};


export const bulkUpsertDigitalAssets = async (assets: IGalleryAsset[]): Promise<void> => {
  try {
    const bulkOps: mongoose.AnyBulkWriteOperation<IGalleryAsset>[] = assets.map(asset => ({
      updateOne: {
        filter: { link: asset.link }, // Assuming URL is unique
        update: { $set: asset },
        upsert: true,
      },
    }));

    await DigitalAssetModel.bulkWrite(bulkOps);
  } catch (error: any) {
    throw new Error(`Failed to bulk upsert digital assets: ${error.message}`);
  }
};



