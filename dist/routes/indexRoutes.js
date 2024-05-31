"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRoute = void 0;
const express_1 = __importDefault(require("express"));
const helloController_1 = require("../controllers/helloController");
const authRoute_1 = __importDefault(require("./authRoute"));
const userRoute_1 = require("./userRoute");
const courseRoute_1 = require("./courseRoute");
const router = express_1.default.Router();
exports.indexRoute = router;
router.get('/', helloController_1.helloController);
router.use('/auth', authRoute_1.default);
router.use('/user', userRoute_1.UserRouter);
router.use('/course', courseRoute_1.CourseRouter);
