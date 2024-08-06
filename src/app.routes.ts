import express from 'express'
import adminRoutes from './modules/routes/index'
import categoryRoutes from './modules/category/routes'
import productRoutes from './modules/product/routes'
import { verify_token } from './middlewares/verifyJWT'

const router = express.Router()

// admin
router.use('/admin', adminRoutes)
// protected routes
router.use(verify_token)
// category
router.use('/admin/category', categoryRoutes)
// product
router.use('/admin/product', productRoutes)

export default router