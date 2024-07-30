import express from 'express'
import adminRoutes from './modules/admin/routes/index'
import categoryRoutes from './modules/admin/category/routes'
import { verify_token } from './middlewares/verifyJWT'

const router = express.Router()

// admin
router.use('/admin', adminRoutes)

// protected routes
router.use(verify_token)
// category
router.use('/admin/category', categoryRoutes)

export default router