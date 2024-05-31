"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRouter = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const courseController_1 = require("@/controllers/courseController");
const router = express_1.default.Router();
exports.CourseRouter = router;
router.get('/', passport_1.default.authenticate('jwt', { session: false }), courseController_1.getAllCoursesController);
