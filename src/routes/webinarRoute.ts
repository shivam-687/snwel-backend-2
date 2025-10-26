import express from 'express';
import {
  createWebinarController,
  getWebinarByIdController,
  updateWebinarByIdController,
  deleteWebinarByIdController,
  addHostsToWebinarController,
  getAllWebinarController,
  getWebinarBySlugController,
  getAllPublicWebinarController
} from '@/controllers/webinarController';
import passport from '@/config/passport-config';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = express.Router();

// Define routes for webinars
router.get('/open', getAllPublicWebinarController); // Get all webinars
router.post('/',passport.authenticate('jwt', {session: false}), checkPermission('WEBINAR_CREATE'), createWebinarController); // Create a new webinar
router.get('/slug/:slug', getWebinarBySlugController); // Get a webinar by ID
router.get('/:id', getWebinarByIdController); // Get a webinar by ID
router.get('/',passport.authenticate('jwt', {session: false}), checkPermission('WEBINAR_VIEW'), getAllWebinarController); // Get all webinars
router.put('/:id', passport.authenticate('jwt', {session: false}), checkPermission('WEBINAR_UPDATE'), updateWebinarByIdController); // Update a webinar by ID
router.delete('/:id', passport.authenticate('jwt', {session: false}), checkPermission('WEBINAR_DELETE'), deleteWebinarByIdController); // Delete a webinar by ID
router.post('/:id/hosts', passport.authenticate('jwt', {session: false}), checkPermission('WEBINAR_UPDATE'), addHostsToWebinarController); // Add hosts to a webinar

export { router as WebinarRouter };
