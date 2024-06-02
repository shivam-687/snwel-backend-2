"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCategoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const courseCategoryController_1 = require("../controllers/courseCategoryController");
const router = express_1.default.Router();
exports.CourseCategoryRouter = router;
// GET all course categories
router.get('/', courseCategoryController_1.getAllCategories);
// GET course category by ID
router.get('/:id', courseCategoryController_1.getCategoryById);
// POST create course category
router.post('/', courseCategoryController_1.createCategory);
// PUT update course category by ID
router.put('/:id', courseCategoryController_1.updateCategoryById);
// DELETE delete course category by ID
router.delete('/:id', courseCategoryController_1.deleteCategoryById);
router.patch('/attach', courseCategoryController_1.attachParent);
