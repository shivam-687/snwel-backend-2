"use strict";
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
router.post('/', (0, validateSchema_1.validateSchema)(snwelEnquirySchema_1.createEnquirySchema), snwelEnquiryController_1.createEnquiryController);
router.get('/export', passport_1.default.authenticate('jwt', { session: false }), snwelEnquiryController_1.exportEnquiriesController);
router.get('/', passport_1.default.authenticate('jwt', { session: false }), snwelEnquiryController_1.getAllEnquiriesController);
router.get('/:id', passport_1.default.authenticate('jwt', { session: false }), snwelEnquiryController_1.getEnquiryByIdController);
router.put('/:id', passport_1.default.authenticate('jwt', { session: false }), (0, validateSchema_1.validateSchema)(snwelEnquirySchema_1.updateEnquirySchema), snwelEnquiryController_1.updateEnquiryByIdController);
router.delete('/:id', passport_1.default.authenticate('jwt', { session: false }), snwelEnquiryController_1.deleteEnquiryByIdController);
