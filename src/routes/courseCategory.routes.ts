import express from 'express';
import { getAllCategories, createCategory, getCategoryById, updateCategoryById, deleteCategoryById, attachParent } from '../controllers/courseCategoryController';
import { validateSchema } from '@/middleware/validateSchema';



const router = express.Router();

// GET all course categories
router.get('/', getAllCategories);

// GET course category by ID
router.get('/:id', getCategoryById);

// POST create course category
router.post('/', createCategory);

// PUT update course category by ID
router.put('/:id', updateCategoryById);

// DELETE delete course category by ID
router.delete('/:id', deleteCategoryById);

router.patch('/attach', attachParent);

export  {router as CourseCategoryRouter};
