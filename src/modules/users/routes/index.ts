import express from 'express'
import {
   getActiveUsers,
   getBlockedUsers,
   getUnActiveUsers,
   getUnBlockedUsers,
   getUnVerifiedUsers,
   getVerifiedUsers,
   getAllUsers,
   toggleUser,
   getUser
} from '../controller'

const router = express.Router()

router.get('/get-active-users', getActiveUsers)
router.get('/get-blocked-users', getBlockedUsers)
router.get('/get-unactive-users', getUnActiveUsers)
router.get('/get-unblocked-users', getUnBlockedUsers)
router.get('/get-unverified-users', getUnVerifiedUsers)
router.get('/get-verified-users', getVerifiedUsers)
router.get('/get-all-users', getAllUsers)
router.get('/get-user', getUser)
router.patch('/toggle-user', toggleUser)

export default router