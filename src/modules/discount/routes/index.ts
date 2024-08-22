import express from 'express'
import { addDiscountOnProduct, deleteDiscountOnProduct, getAllDiscount, getDiscount, updateDiscountOnProduct } from '../controller'

const router = express.Router()

router.post('/add-discount', addDiscountOnProduct)
router.get('/get-discount', getDiscount)
router.get('/get-all-discount', getAllDiscount)
router.patch('/update-discount', updateDiscountOnProduct)
router.delete('/delete-discount', deleteDiscountOnProduct)

export default router