"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryRouter = void 0;
// routes/enquiryRoutes.ts
const express_1 = require("express");
const enquiryController_1 = require("../controllers/enquiryController");
const validateSchema_1 = require("../middleware/validateSchema");
const enquiry_1 = require("../entity-schema/enquiry");
const router = (0, express_1.Router)();
exports.EnquiryRouter = router;
router.post('/', (0, validateSchema_1.validateSchema)(enquiry_1.createEnquiry), enquiryController_1.createEnquiryController);
router.get('/', enquiryController_1.getAllEnquiriesController);
router.get('/:id', enquiryController_1.getEnquiryByIdController);
router.put('/:id', (0, validateSchema_1.validateSchema)(enquiry_1.updateEnquiry), enquiryController_1.updateEnquiryByIdController);
router.delete('/:id', enquiryController_1.deleteEnquiryByIdController);
