import express from 'express'
import {
   addBundle,
   deleteBundle,
   getAllBlockedBundle,
   getBlockedBundle,
   getBundle,
   getAllBundle,
   toggleBundle,
   removeBundleProduct,
   updateBundle
} from '../controllers'


const router = express.Router()

router.post('/add-bundle', addBundle)
router.get('/get-bundle', getBundle)
router.get('/get-all-bundles', getAllBundle)
router.patch('/update-bundle', updateBundle)
router.delete('/delete-bundle', deleteBundle)
router.patch('/toggle-bundle', toggleBundle)
router.get('/get-blocked-bundle', getBlockedBundle)
router.get('/get-all-blocked-bundle', getAllBlockedBundle)
router.patch('/remove-bundle-product', removeBundleProduct)

export default router