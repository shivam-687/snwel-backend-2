import { Request, Response } from 'express';
import {
  createMasterItem,
  getAllMasterItems,
  getMasterItem,
  updateMasterItemByCode,
  deleteMasterItemByCode,
} from '@/service/master';
import { successResponse, errorResponse } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { extractListOptions } from '@/utils/helpers';

const createMasterItemController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const masterData = req.body;

  const newMasterItem = await createMasterItem(masterData);
  successResponse(newMasterItem, res, { message: 'Master item created successfully!' });
});

const getAllMasterItemsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const options = { ...req.query };
  console.log({options})
  const masterItems = await getAllMasterItems(extractListOptions(req));
  console.log({masterItems: JSON.stringify(masterItems)})
  successResponse(masterItems, res, { message: 'Master items fetched successfully!' });
});

const getMasterItemController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { idOrCode } = req.params;
  const masterItem = await getMasterItem(idOrCode);
  if (!masterItem) {
    return errorResponse('Master item not found', res);
  }
  successResponse(masterItem, res, { message: 'Master item fetched successfully!' });
});

const updateMasterItemByCodeController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { idOrCode } = req.params;
  const updateData = req.body;
  const updatedMasterItem = await updateMasterItemByCode(idOrCode, updateData);
  if (!updatedMasterItem) {
    return errorResponse('Master item not found', res);
  }
  successResponse(updatedMasterItem, res, { message: 'Master item updated successfully!' });
});

const deleteMasterItemByCodeController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await deleteMasterItemByCode(id);
  successResponse(null, res, { message: 'Master item deleted successfully!' });
});

export {
  createMasterItemController,
  getAllMasterItemsController,
  getMasterItemController,
  updateMasterItemByCodeController,
  deleteMasterItemByCodeController,
};
