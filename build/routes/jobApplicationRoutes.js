"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationRouter = void 0;
const express_1 = require("express");
const jobApplicationController_1 = require("../controllers/jobApplicationController");
const validateSchema_1 = require("../middleware/validateSchema");
const jobApplication_1 = require("../entity-schema/jobApplication");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
exports.JobApplicationRouter = router;
router.post('/', (0, validateSchema_1.validateSchema)(jobApplication_1.createJobApplicationSchema), jobApplicationController_1.createJobApplicationController);
router.get('/export', jobApplicationController_1.exportJobApplicationsController);
router.get('/', passport_1.default.authenticate('jwt', { session: false }), jobApplicationController_1.getAllJobApplicationsController);
router.get('/:id', passport_1.default.authenticate('jwt', { session: false }), jobApplicationController_1.getJobApplicationByIdController);
router.put('/:id', passport_1.default.authenticate('jwt', { session: false }), (0, validateSchema_1.validateSchema)(jobApplication_1.updateJobApplicationSchema), jobApplicationController_1.updateJobApplicationByIdController);
router.delete('/:id', passport_1.default.authenticate('jwt', { session: false }), jobApplicationController_1.deleteJobApplicationByIdController);
