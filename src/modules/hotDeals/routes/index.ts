import express from 'express'
import {
   createHotDeal,
   updateHotDeal,
   getAllHotDeals,
   getHotDeal,
   deleteHotDeal
} from '../controller'

const router = express.Router()

router.post('/create-hotdeal', createHotDeal)
router.get('/get-hotdeal', getHotDeal)
router.get('/get-all-hotdeals', getAllHotDeals)
router.patch('/update-hotdeal', updateHotDeal)
router.delete('/delete-hotdeal', deleteHotDeal)

export default router