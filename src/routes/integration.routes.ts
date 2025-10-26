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
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = Router();

// All integration routes require authentication and permissions
router.get('/', passport.authenticate('jwt', { session: false }), checkPermission('INTEGRATION_VIEW'), getAllIntegrationsController);
router.get('/types', passport.authenticate('jwt', { session: false }), checkPermission('INTEGRATION_VIEW'), getIntegrationTypesController);
router.get('/:id', passport.authenticate('jwt', { session: false }), checkPermission('INTEGRATION_VIEW'), getIntegrationByIdController);
router.post('/', passport.authenticate('jwt', { session: false }), checkPermission('INTEGRATION_UPDATE'), createIntegrationController);
router.put('/:id', passport.authenticate('jwt', { session: false }), checkPermission('INTEGRATION_UPDATE'), updateIntegrationByIdController);
router.delete('/:id', passport.authenticate('jwt', { session: false }), checkPermission('INTEGRATION_UPDATE'), deleteIntegrationByIdController);

export { router as IntegrationRouter };
