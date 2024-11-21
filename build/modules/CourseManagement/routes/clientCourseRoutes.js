"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCourseRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/courses');
router.get('/courses/:id');
router.get('/categories');
router.post('/courses/:id/enroll', auth_middleware_1.authenticateJWT);
router.get('/my-courses', auth_middleware_1.authenticateJWT);
router.post('/courses/:id/review', auth_middleware_1.authenticateJWT);
router.get('/my-enrollments', auth_middleware_1.authenticateJWT);
router.patch('/enrollments/:id/progress', auth_middleware_1.authenticateJWT);
exports.ClientCourseRouter = router;
