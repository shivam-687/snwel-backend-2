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

const router = Router();

router.post('/', validateSchema(createGalleryAssetSchema), createDigitalAssetController);
router.get('/', passport.authenticate('jwt', { session: false }), getAllDigitalAssetsController);
router.get('/:id', passport.authenticate('jwt', { session: false }), getDigitalAssetByIdController);
router.put('/:id', passport.authenticate('jwt', { session: false }), validateSchema(updateGalleryAssetSchema), updateDigitalAssetByIdController);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteDigitalAssetByIdController);
router.post('/bulk-upsert', passport.authenticate('jwt', { session: false }), validateSchema(createGalleryAssetSchema.array()), bulkUpsertDigitalAssetsController);

export { router as GalleryRouter };
