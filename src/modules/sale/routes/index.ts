import express from 'express'
import {
   createSale,
   getAllSales,
   getSale,
   deleteSale,
   toggleSale,
   updateSale
} from '../controller'

const router = express.Router()

router.post('/create-sale', createSale)
router.get('/get-sale', getSale)
router.get('/get-all-sales', getAllSales)
router.patch('/update-sale', updateSale)
router.patch('/toggle-sale', toggleSale)
router.delete('/delete-sale', deleteSale)

export default router