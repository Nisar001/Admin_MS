import express from 'express'
import { registerAdmin } from '../controller'

const router = express.Router()


router.post('/register/admin', registerAdmin)

export default router