import { Request, Response } from "express";
import { Product } from "../../../models/product";
import { AdminDiscount } from "../../../models/discount";
import mongoose from "mongoose";
import moment from "moment";

export const addDiscountOnMultiPleProduct = async (req: Request, res: Response) => {
   try {
      const { _id, role } = req.user
      const { _storeId, discountType, productsId, discountValue, startDate, endDate } = req.body
      const isNonEmpty = (field: any) => {
         if (typeof field === 'string') {
            return field.trim() !== '';
         }
         if (typeof field === 'number') {
            return !isNaN(field);  // Ensure it's a valid number
         }
         return false;
      };
      if (!isNonEmpty(discountType) || !isNonEmpty(discountType) || !isNonEmpty(startDate) || !isNonEmpty(endDate)) {
         return res.status(400).json({ error: 'Fields cannot be empty' })
      }
      if (startDate && endDate) {
         const start_date = moment(startDate, 'YYYY-MM-DD')
         const end_date = moment(endDate, 'YYYY-MM-DD')
         if (start_date.isAfter(end_date)) {
            return res.status(400).json({ error: 'startDate cannot be greater than endDate' })
         }
         if (!start_date.isValid() || !end_date.isValid()) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' })
         }
         const today = moment().startOf('day')
         if (start_date.isBefore(today) || end_date.isBefore(today)) {
            return res.status(400).json({ error: 'Dates cannot be in the past.' })
         }
      }
      const productIds = productsId.map((id: string) => new mongoose.Types.ObjectId(id))
      const products = await Product.find({
         _id: { $in: productIds },
         isDeleted: false,
         isBlocked: false,
      })
      const existingProduct = await AdminDiscount.findOne({ _product: { $in: productIds } })
      if (existingProduct) {
         return res.status(400).json({ error: 'Discount already on these products' })
      }
      if (products.length !== productsId.length) {
         return res.status(404).json({ error: 'Some Products not found' })
      }
      const discount = await AdminDiscount.create({
         _admin: _id,
         _store: _storeId,
         _product: productIds,
         discountType: discountType,
         discountValue: discountValue,
         startDate: startDate,
         endDate: endDate
      })
      return res.status(200).json({ success: true, message: 'Discount added on the products', discount })

   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error })
   }
}