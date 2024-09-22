import { Request, Response } from 'express';
import { 
  createDigitalAsset,
  getDigitalAssetById,
  updateDigitalAssetById,
  deleteDigitalAssetById,
  getAllDigitalAssets,
  bulkUpsertDigitalAssets
} from '@/service/allery-asset-service';
import { errorResponseFromError, successResponse } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';

// Controller function to create a new digital asset
export async function createDigitalAssetController(req: Request, res: Response): Promise<void> {
  try {
    const digitalAssetData = req.body; // Assuming digital asset data is sent in the request body
    const newDigitalAsset = await createDigitalAsset(digitalAssetData);
    successResponse(newDigitalAsset, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to get a digital asset by ID
export async function getDigitalAssetByIdController(req: Request, res: Response): Promise<void> {
  try {
    const digitalAssetId = req.params.id;
    const digitalAsset = await getDigitalAssetById(digitalAssetId);
    if (!digitalAsset) {
      res.status(404).json({ message: 'Digital Asset not found' });
      return;
    }
    successResponse(digitalAsset, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to update a digital asset by ID
export async function updateDigitalAssetByIdController(req: Request, res: Response): Promise<void> {
  try {
    const digitalAssetId = req.params.id;
    const updateData = req.body;
    const updatedDigitalAsset = await updateDigitalAssetById(digitalAssetId, updateData);
    if (!updatedDigitalAsset) {
      res.status(404).json({ message: 'Digital Asset not found' });
      return;
    }
    successResponse(updatedDigitalAsset, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to delete a digital asset by ID
export async function deleteDigitalAssetByIdController(req: Request, res: Response): Promise<void> {
  try {
    const digitalAssetId = req.params.id;
    await deleteDigitalAssetById(digitalAssetId);
    successResponse({ message: 'Digital Asset deleted successfully' }, res);
  } catch (error) {
    errorResponseFromError(error, res);
  }
}

// Controller function to get all digital assets with pagination
export const getAllDigitalAssetsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const options = req.query;
  const digitalAssets = await getAllDigitalAssets(options);
  return successResponse(digitalAssets, res, { message: "Digital Assets fetched successfully!" });
});

export const bulkUpsertDigitalAssetsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const assets = req.body; // Assuming the array of assets is sent in the request body
  await bulkUpsertDigitalAssets(assets);
  successResponse({ message: 'Digital assets upserted successfully!' }, res);
});

