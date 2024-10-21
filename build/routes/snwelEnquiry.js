"use strict";
// src/routes/enquiryRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnwelEnquiryRouter = void 0;
const express_1 = require("express");
const snwelEnquiryController_1 = require("../controllers/snwelEnquiryController");
const validateSchema_1 = require("../middleware/validateSchema");
const snwelEnquirySchema_1 = require("../entity-schema/snwelEnquirySchema");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
exports.SnwelEnquiryRouter = router;
// Route to create a new enquiry
router.post('/', (0, validateSchema_1.validateSchema)(snwelEnquirySchema_1.createEnquirySchema), snwelEnquiryController_1.createEnquiryController);
// Route to export enquiries to a CSV file
router.get('/export', passport_1.default.authenticate('jwt', { session: false }), snwelEnquiryController_1.exportEnquiriesController);
// Route to get all enquiries with pagination
router.get('/', passport_1.default.authenticate('jwt', { session: false }), snwelEnquiryController_1.getAllEnquiriesController);
// Route to get a single enquiry by ID
router.get('/:id', passport_1.default.authenticate('jwt', { session: false }), snwelEnquiryController_1.getEnquiryByIdController);
// Route to update an enquiry by ID
router.put('/:id', passport_1.default.authenticate('jwt', { session: false }), (0, validateSchema_1.validateSchema)(snwelEnquirySchema_1.updateEnquirySchema), snwelEnquiryController_1.updateEnquiryByIdController);
// Route to delete an enquiry by ID
router.delete('/:id', passport_1.default.authenticate('jwt', { session: false }), snwelEnquiryController_1.deleteEnquiryByIdController);
