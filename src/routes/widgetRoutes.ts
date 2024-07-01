// routes/widgetRoutes.ts
import { Router } from 'express';
import {
    createWidgetController,
    getAllWidgetsController,
    getWidgetByIdController,
    updateWidgetByIdController,
    deleteWidgetByIdController,
    getWidgetTypesController, // Add this line
  } from '@/controllers/widgetController';
  
  const router = Router();
  
  router.post('/', createWidgetController);
  router.get('/', getAllWidgetsController);
  router.get('/types', getWidgetTypesController); // Add this line
  router.get('/:id', getWidgetByIdController);
  router.put('/:id', updateWidgetByIdController);
  router.delete('/:id', deleteWidgetByIdController);
  
  export {router as WidgetRouter};
  