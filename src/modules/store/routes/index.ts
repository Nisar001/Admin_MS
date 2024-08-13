import express from 'express'
import {
   getAllStores,
   getBlockedStores,
   getStoreById,
   getUnblockedStores,
   toggleStore
} from '../controller'

const router = express.Router()

router.get('/get-all-stores', getAllStores)
router.get('/get-blocked-stores', getBlockedStores)
router.get('/get-store', getStoreById)
router.get('/get-unblocked-stores', getUnblockedStores)
router.patch('/toggle-store', toggleStore)

export default router