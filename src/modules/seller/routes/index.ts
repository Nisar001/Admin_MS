import express from 'express'
import {
   getAllSellers,
   getActiveSellers,
   getUnActiveSellers,
   getBlockedSellers,
   getUnBlockedSellers,
   getVerifiedSellers,
   getUnVerifiedSellers,
   toggleSeller,
   getSeller
} from '../controller'

const router = express.Router()

router.get('/get-all-sellers', getAllSellers)
router.get('/get-active-sellers', getActiveSellers)
router.get('/get-unactive-sellers', getUnActiveSellers)
router.get('/get-blocked-sellers', getBlockedSellers)
router.get('/get-unblocked-sellers', getUnBlockedSellers)
router.get('/get-verified-sellers', getVerifiedSellers)
router.get('/get-unverified-sellers', getUnVerifiedSellers)
router.get('/get-seller', getSeller)
router.patch('/toggle-seller', toggleSeller)

export default router