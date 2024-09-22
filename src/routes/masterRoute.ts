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

const router = Router();

router.post('/', validateSchema(createMasterItemSchema), createMasterItemController);
router.get('/', getAllMasterItemsController);
router.get('/:idOrCode', getMasterItemController);
router.put('/:idOrCode', validateSchema(updateMasterItemSchema), updateMasterItemByCodeController);
router.delete('/:id', deleteMasterItemByCodeController);

export { router as MasterRouter };
