// src/routes/enquiryRoutes.ts

import { Router } from 'express';
import {
  createEnquiryController,
  getAllEnquiriesController,
  getEnquiryByIdController,
  updateEnquiryByIdController,
  deleteEnquiryByIdController,
  exportEnquiriesController,
} from '@/controllers/snwelEnquiryController';
import { validateSchema } from '@/middleware/validateSchema';
import { createEnquirySchema, updateEnquirySchema } from '@/entity-schema/snwelEnquirySchema';
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = Router();

// Route to create a new enquiry
router.post('/', validateSchema(createEnquirySchema), createEnquiryController);

// Route to export enquiries to a CSV file
router.get('/export', passport.authenticate('jwt', { session: false }), checkPermission('SNWEL_ENQUIRY_EXPORT'), exportEnquiriesController);

// Route to get all enquiries with pagination
router.get('/', passport.authenticate('jwt', { session: false }), checkPermission('SNWEL_ENQUIRY_VIEW'), getAllEnquiriesController);

// Route to get a single enquiry by ID
router.get('/:id', passport.authenticate('jwt', { session: false }), checkPermission('SNWEL_ENQUIRY_VIEW'), getEnquiryByIdController);

// Route to update an enquiry by ID
router.put('/:id', passport.authenticate('jwt', { session: false }), checkPermission('SNWEL_ENQUIRY_UPDATE'), validateSchema(updateEnquirySchema), updateEnquiryByIdController);

// Route to delete an enquiry by ID
router.delete('/:id', passport.authenticate('jwt', { session: false }), checkPermission('SNWEL_ENQUIRY_DELETE'), deleteEnquiryByIdController);

export { router as SnwelEnquiryRouter };
