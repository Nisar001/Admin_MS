import { Discount } from '../../../models/discount'
import { Request, Response } from 'express'

export const getAllDiscount = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized Access' })
      }
      const { page = 1, limit = 10, search } = req.query
      const pageNumber = parseInt(page as string)
      const limitNumber = parseInt(limit as string)
      const searchFilter = search
         ? { discountType: { $regex: search, $options: 'i' } }
         : { _id }
      const discount = await Discount.find(searchFilter).populate('_product')
         .sort({ discountType: 1 })
         .skip((pageNumber - 1) * limitNumber)
         .limit(limitNumber)

      if (!discount) {
         return res.status(404).json({ message: 'Discount Not Found' })
      }

      const totalCounts = await Discount.countDocuments(searchFilter)
      return res.status(200).json({
         success: true,
         page: pageNumber,
         totalItems: totalCounts,
         totalPages: Math.ceil(totalCounts / limitNumber),
         data: discount,
      })
   } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message })
   }
}