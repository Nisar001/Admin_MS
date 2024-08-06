import { Discount } from "../../../../models/discount";
import { Request, Response } from "express";


export const getDiscount = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized access' })
      }
      const { _discountId } = req.query
      const discount = await Discount.findOne({ _id: _discountId }).populate('_product')
      if (!discount) {
         return res.status(400).json({ success: false, error: 'Invalid discount id' })
      }
      return res.status(200).json({ success: true, data: discount })
   } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, error: error.message })
   }
}