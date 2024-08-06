import express from 'express'
import { registerAdmin } from '../controller'
import { loginAdmin } from '../controller'

const router = express.Router()


router.post('/register', registerAdmin)
router.post('/login', loginAdmin)


export default router