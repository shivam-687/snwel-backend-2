"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetRouter = void 0;
// routes/widgetRoutes.ts
const express_1 = require("express");
const widgetController_1 = require("../controllers/widgetController");
const router = (0, express_1.Router)();
exports.WidgetRouter = router;
router.post('/', widgetController_1.createWidgetController);
router.get('/', widgetController_1.getAllWidgetsController);
router.get('/types', widgetController_1.getWidgetTypesController); // Add this line
router.get('/:id', widgetController_1.getWidgetByIdController);
router.put('/:id', widgetController_1.updateWidgetByIdController);
router.delete('/:id', widgetController_1.deleteWidgetByIdController);