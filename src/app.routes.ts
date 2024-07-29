import express from 'express'
import adminRoutes from './modules/admin/routes/index'

const router = express.Router()

router.use('/admin', adminRoutes)

export default router