import { Router } from 'express';
import {
  createMasterItemController,
  getAllMasterItemsController,
  getMasterItemController,
  updateMasterItemByCodeController,
  deleteMasterItemByCodeController,
} from '@/controllers/masterController';
import { validateSchema } from '@/middleware/validateSchema';
import { createMasterItemSchema, updateMasterItemSchema } from '@/entity-schema/master';
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = Router();

// Public routes - master data can be viewed by anyone
router.get('/', getAllMasterItemsController);
router.get('/:idOrCode', getMasterItemController);

// Admin routes (require authentication and permissions)
router.post('/', passport.authenticate('jwt', { session: false }), checkPermission('MASTER_CREATE'), validateSchema(createMasterItemSchema), createMasterItemController);
router.put('/:idOrCode', passport.authenticate('jwt', { session: false }), checkPermission('MASTER_UPDATE'), validateSchema(updateMasterItemSchema), updateMasterItemByCodeController);
router.delete('/:id', passport.authenticate('jwt', { session: false }), checkPermission('MASTER_DELETE'), deleteMasterItemByCodeController);

export { router as MasterRouter };
