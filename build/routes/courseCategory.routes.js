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
router.get('/', courseCategoryController_1.getAllCategories);
router.get('/:id', courseCategoryController_1.getCategoryById);
router.post('/', courseCategoryController_1.createCategory);
router.put('/:id', courseCategoryController_1.updateCategoryById);
router.delete('/:id', courseCategoryController_1.deleteCategoryById);
router.patch('/attach', courseCategoryController_1.attachParent);
