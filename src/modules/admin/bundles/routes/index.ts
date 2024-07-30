import express from 'express'
import {
   createBundleProductSale,
   getBundleProductSale,
   getAllBundleProductSale,
   updateBundleProductSale,
   deleteBundleProductSale
} from '../controllers'


const router = express.Router()

router.post('/add-bundle', createBundleProductSale)
router.get('/get-bundle/:bundleId', getBundleProductSale)
router.get('/get-all-bundle/:sellerId', getAllBundleProductSale)
router.patch('/bundle/:bundleId', updateBundleProductSale)
router.delete('/bundle/:bundleId', deleteBundleProductSale)

export default router