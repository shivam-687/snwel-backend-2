import { Router } from 'express';
import {
  createDigitalAssetController,
  getAllDigitalAssetsController,
  getDigitalAssetByIdController,
  updateDigitalAssetByIdController,
  deleteDigitalAssetByIdController,
  bulkUpsertDigitalAssetsController,
} from '@/controllers/gallerAssetController';
import { validateSchema } from '@/middleware/validateSchema';
import { createGalleryAssetSchema, updateGalleryAssetSchema } from '@/entity-schema/galleryAssetsSchema';
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = Router();

router.post('/', validateSchema(createGalleryAssetSchema), createDigitalAssetController);
router.get('/', getAllDigitalAssetsController);
router.get('/:id', getDigitalAssetByIdController);
router.put('/:id', passport.authenticate('jwt', { session: false }), checkPermission('GALLERY_UPDATE'), validateSchema(updateGalleryAssetSchema), updateDigitalAssetByIdController);
router.delete('/:id', passport.authenticate('jwt', { session: false }), checkPermission('GALLERY_DELETE'), deleteDigitalAssetByIdController);
router.post('/bulk-upsert', passport.authenticate('jwt', { session: false }), checkPermission('GALLERY_CREATE'), validateSchema(createGalleryAssetSchema.array()), bulkUpsertDigitalAssetsController);

export { router as GalleryRouter };
