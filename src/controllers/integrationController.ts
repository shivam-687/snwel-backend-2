// controllers/integrationController.ts
import { Request, Response } from 'express';
import {
  createIntegration,
  getAllIntegrations,
  getIntegrationById,
  updateIntegrationById,
  deleteIntegrationById,
  getIntegrationTypes
} from '@/service/IntegrationService';
import { successResponse, errorResponse } from '@/utils/helpers/appResponse';
import { catchAsync } from '@/utils/helpers/catchAsync';

const createIntegrationController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const integrationData = req.body;
  const newIntegration = await createIntegration(integrationData);
  successResponse(newIntegration, res, { message: 'Integration created successfully!' });
});

const getAllIntegrationsController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const options = { ...req.query };
  const integrations = await getAllIntegrations(options);
  successResponse(integrations, res, { message: 'Integrations fetched successfully!' });
});

const getIntegrationByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const integration = await getIntegrationById(id);
  if (!integration) {
    return errorResponse('Integration not found', res);
  }
  successResponse(integration, res, { message: 'Integration fetched successfully!' });
});

const updateIntegrationByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedIntegration = await updateIntegrationById(id, updateData);
  if (!updatedIntegration) {
    return errorResponse('Integration not found', res);
  }
  successResponse(updatedIntegration, res, { message: 'Integration updated successfully!' });
});

const deleteIntegrationByIdController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await deleteIntegrationById(id);
  successResponse(null, res, { message: 'Integration deleted successfully!' });
});

const getIntegrationTypesController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const integrationTypes = await getIntegrationTypes();
  successResponse(integrationTypes, res, { message: 'Integration types fetched successfully!' });
});

export {
  createIntegrationController,
  getAllIntegrationsController,
  getIntegrationByIdController,
  updateIntegrationByIdController,
  deleteIntegrationByIdController,
  getIntegrationTypesController
};
