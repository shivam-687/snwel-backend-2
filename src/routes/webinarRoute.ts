import express from 'express';
import {
  createWebinarController,
  getWebinarByIdController,
  updateWebinarByIdController,
  deleteWebinarByIdController,
  addHostsToWebinarController,
  getAllWebinarController,
  getWebinarBySlugController
} from '@/controllers/webinarController';
import passport from '@/config/passport-config';

const router = express.Router();

// Define routes for webinars
router.post('/',passport.authenticate('jwt', {session: false}), createWebinarController); // Create a new webinar
router.get('/slug/:slug', getWebinarBySlugController); // Get a webinar by ID
router.get('/:id', getWebinarByIdController); // Get a webinar by ID
router.get('/', getAllWebinarController); // Get all webinars
router.put('/:id', updateWebinarByIdController); // Update a webinar by ID
router.delete('/:id', deleteWebinarByIdController); // Delete a webinar by ID
router.post('/:id/hosts', addHostsToWebinarController); // Add hosts to a webinar

export { router as WebinarRouter };
