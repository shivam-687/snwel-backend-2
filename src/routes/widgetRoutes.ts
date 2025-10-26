// routes/widgetRoutes.ts
import { Router } from 'express';
import {
    createWidgetController,
    getAllWidgetsController,
    getWidgetByIdController,
    updateWidgetByIdController,
    deleteWidgetByIdController,
    getWidgetTypesController, 
  } from '@/controllers/widgetController';
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = Router();

// Public routes
router.get('/', getAllWidgetsController);
router.get('/types', getWidgetTypesController);
router.get('/:id', getWidgetByIdController);

// Admin routes (require authentication and permissions)
router.post('/', passport.authenticate('jwt', { session: false }), checkPermission('WIDGET_CREATE'), createWidgetController);
router.put('/:id', passport.authenticate('jwt', { session: false }), checkPermission('WIDGET_UPDATE'), updateWidgetByIdController);
router.delete('/:id', passport.authenticate('jwt', { session: false }), checkPermission('WIDGET_DELETE'), deleteWidgetByIdController);

export {router as WidgetRouter};