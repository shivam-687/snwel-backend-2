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

const router = Router();

router.post('/', validateSchema(createEnquiry), createEnquiryController);
router.get('/', getAllEnquiriesController);
router.get('/:id', getEnquiryByIdController);
router.put('/:id', validateSchema(updateEnquiry), updateEnquiryByIdController);
router.delete('/:id', deleteEnquiryByIdController);

export { router as EnquiryRouter };
