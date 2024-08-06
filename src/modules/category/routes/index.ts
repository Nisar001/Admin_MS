import express from 'express'
import { createCategory, deleteCategory, getAllCategory, getCategoryById, updateCategory } from '../controller'

const router = express.Router()

router.post('/create', createCategory)
router.patch('/update', updateCategory)
router.get('/get-category', getCategoryById)
router.get('/getAll', getAllCategory)
router.delete('/delete', deleteCategory)

export default router