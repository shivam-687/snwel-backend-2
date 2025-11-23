// src/components/testimonial/client-routes.ts

import { Router } from 'express';
import {
    getPublishedTestimonialsController,
    getTestimonialByIdController
} from './client-testimonial-controller';

const router = Router();

// Route to get all published testimonials
router.get('/guest/testimonials', getPublishedTestimonialsController);

// Route to get a published testimonial by ID
router.get('/guest/testimonials/:id', getTestimonialByIdController);

export { router as ClientTestimonialRouter };
