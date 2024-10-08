"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobVacancyRouter = void 0;
const express_1 = require("express");
const jobVacancyController_1 = require("../controllers/jobVacancyController");
const validateSchema_1 = require("../middleware/validateSchema");
const jobVacancy_1 = require("../entity-schema/jobVacancy");
const router = (0, express_1.Router)();
exports.JobVacancyRouter = router;
router.post('/', (0, validateSchema_1.validateSchema)(jobVacancy_1.createJobVacancySchema), jobVacancyController_1.createJobVacancyController);
router.get('/', jobVacancyController_1.getAllJobVacanciesController);
router.get('/:idOrSlug', jobVacancyController_1.getJobVacancyController);
router.put('/:id', (0, validateSchema_1.validateSchema)(jobVacancy_1.updateJobVacancySchema), jobVacancyController_1.updateJobVacancyByIdController);
router.delete('/:id', jobVacancyController_1.deleteJobVacancyByIdController);
