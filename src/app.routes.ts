import express from 'express'
import adminRoutes from './modules/routes/index'
import categoryRoutes from './modules/category/routes'
import discountRoutes from './modules/discount/routes'
import productRoutes from './modules/product/routes'
import bundleRoutes from './modules/bundles/routes'
import { verify_token } from './middlewares/verifyJWT'

const router = express.Router()

// admin
router.use('/admin', adminRoutes)
// protected routes
router.use(verify_token)
// category
router.use('/admin/category', categoryRoutes)
//discount
router.use('/admin/discount', discountRoutes)
// product
router.use('/admin/product', productRoutes)
//bundles
router.use('/admin/bundle', bundleRoutes)


export default router