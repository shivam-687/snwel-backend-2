"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterRouter = void 0;
const express_1 = require("express");
const masterController_1 = require("../controllers/masterController");
const validateSchema_1 = require("../middleware/validateSchema");
const master_1 = require("../entity-schema/master");
const router = (0, express_1.Router)();
exports.MasterRouter = router;
router.post('/', (0, validateSchema_1.validateSchema)(master_1.createMasterItemSchema), masterController_1.createMasterItemController);
router.get('/', masterController_1.getAllMasterItemsController);
router.get('/:id', masterController_1.getMasterItemController);
router.put('/:id', (0, validateSchema_1.validateSchema)(master_1.updateMasterItemSchema), masterController_1.updateMasterItemByCodeController);
router.delete('/:id', masterController_1.deleteMasterItemByCodeController);
