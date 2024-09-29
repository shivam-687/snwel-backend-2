// routes/integrationRoutes.ts
import { Router } from 'express';
import {
  createIntegrationController,
  getAllIntegrationsController,
  getIntegrationByIdController,
  updateIntegrationByIdController,
  deleteIntegrationByIdController,
  getIntegrationTypesController
} from '@/controllers/integrationController';

const router = Router();

router.post('/', createIntegrationController);
router.get('/', getAllIntegrationsController);
router.get('/types', getIntegrationTypesController); // Fetch distinct supported actions
router.get('/:id', getIntegrationByIdController);
router.put('/:id', updateIntegrationByIdController);
router.delete('/:id', deleteIntegrationByIdController);

export { router as IntegrationRouter };
