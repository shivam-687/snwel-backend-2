// routes/enquiryRoutes.ts
import { Router } from 'express';
import {
  createEnquiryController,
  getAllEnquiriesController,
  getEnquiryByIdController,
  updateEnquiryByIdController,
  deleteEnquiryByIdController,
} from '@/controllers/enquiryController';
import { validateSchema } from '@/middleware/validateSchema';
import { createEnquiry, updateEnquiry } from '@/entity-schema/enquiry';
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = Router();

// Public route - anyone can submit an enquiry
router.post('/', validateSchema(createEnquiry), createEnquiryController);

// Admin routes (require authentication and permissions)
router.get('/', passport.authenticate('jwt', { session: false }), checkPermission('ENQUIRY_VIEW'), getAllEnquiriesController);
router.get('/:id', passport.authenticate('jwt', { session: false }), checkPermission('ENQUIRY_VIEW'), getEnquiryByIdController);
router.put('/:id', passport.authenticate('jwt', { session: false }), checkPermission('ENQUIRY_UPDATE'), validateSchema(updateEnquiry), updateEnquiryByIdController);
router.delete('/:id', passport.authenticate('jwt', { session: false }), checkPermission('ENQUIRY_DELETE'), deleteEnquiryByIdController);

export { router as EnquiryRouter };
