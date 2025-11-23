// src/components/testimonial/admin-routes.ts

import { Router } from 'express';
import {
    createTestimonialController,
    getAllTestimonialsController,
    getTestimonialByIdController,
    updateTestimonialController,
    deleteTestimonialController,
} from './admin-testimonial-controller';
import passport from '@/config/passport-config';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = Router();

// Route to create a new testimonial
router.post('/testimonials', passport.authenticate('jwt', { session: false }), checkPermission('TESTIMONIAL_CREATE'), createTestimonialController);

// Route to get all testimonials with optional filters (admin)
router.get('/testimonials', passport.authenticate('jwt', { session: false }), checkPermission('TESTIMONIAL_VIEW'), getAllTestimonialsController);

// Route to get a testimonial by ID
router.get('/testimonials/:id', passport.authenticate('jwt', { session: false }), checkPermission('TESTIMONIAL_VIEW'), getTestimonialByIdController);

// Route to update a testimonial by ID
router.put('/testimonials/:id', passport.authenticate('jwt', { session: false }), checkPermission('TESTIMONIAL_UPDATE'), updateTestimonialController);

// Route to soft delete a testimonial by ID
router.delete('/testimonials/:id', passport.authenticate('jwt', { session: false }), checkPermission('TESTIMONIAL_DELETE'), deleteTestimonialController);

export { router as TestimonialRouter };
