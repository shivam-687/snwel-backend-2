"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRouter = void 0;
const express_1 = __importDefault(require("express"));
const courseControllers_1 = require("../../../components/course/controllers/courseControllers");
const router = express_1.default.Router();
exports.CourseRouter = router;
router.get('/', courseControllers_1.getAllCoursesController);
router.get('/byId/:courseId', courseControllers_1.getCourseByIdController);
router.get('/:slug', courseControllers_1.getCourseBySlugController);
