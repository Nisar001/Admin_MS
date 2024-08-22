import { Request, Response } from 'express'
import { HotDeal } from '../../../models/hotDeals'
import { Product } from '../../../models/product'
import { isValidObjectId } from 'mongoose'

export const deleteHotDeal = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user
      const { hotdealId } = req.query
      if (!isValidObjectId(hotdealId)) {
         return res.status(400).json({ error: 'Invalid Hot Deal Id.' })
      }
      const hotdeal = await HotDeal.findOne({ _id: hotdealId })
      if (!hotdeal) {
         return res.status(404).json({ error: 'Hot Deal not found..' })
      }

      const product = await Product.findOne({ _id: hotdeal.product })
      product.HotDealPrice = null
      await product.save()
      await HotDeal.findByIdAndDelete(hotdealId)
      return res
         .status(200)
         .json({ message: 'Hot Deal deleted successfully' })
   } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message })
   }
}