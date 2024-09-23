"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCourseRouter = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const adminCourseController_1 = require("../../../components/course/controllers/adminCourseController");
const router = express_1.default.Router();
exports.AdminCourseRouter = router;
router.get('/', adminCourseController_1.getAllCoursesController);
router.post('/', passport_1.default.authenticate('jwt', { session: false }), adminCourseController_1.createCourseController);
router.get('/byId/:courseId', adminCourseController_1.getCourseByIdController);
router.put('/partial-update/:courseId', passport_1.default.authenticate('jwt', { session: false }), adminCourseController_1.partialUpdateCourseController);
router.put('/:courseId', passport_1.default.authenticate('jwt', { session: false }), adminCourseController_1.updateCourseController);
router.delete('/:courseId', passport_1.default.authenticate('jwt', { session: false }), adminCourseController_1.deleteCourseController);
router.get('/:slug', adminCourseController_1.getCourseBySlugController);
