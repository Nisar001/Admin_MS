import express from 'express'
import {
   addProduct,
   getAllProduct,
   getAllProductByCategory,
   getProduct,
   updateProduct,
   deleteProduct,
   toggleProduct,
   getAllBlockedProduct,
   availabilityStatus
} from '../controller'


const router = express.Router()

router.post('/add-product', addProduct)
router.get('/get-product', getProduct)
router.get('/get-all-product', getAllProduct)
router.get('/get-all-product-category', getAllProductByCategory)
router.get('/get-all-blocked-products', getAllBlockedProduct)
router.patch('/update-product', updateProduct)
router.patch('/available-status', availabilityStatus)
router.patch('/toggle-product', toggleProduct)
router.delete('/delete-product', deleteProduct)

export default router