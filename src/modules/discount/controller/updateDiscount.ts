import { Discount } from '../../../models/discount';
import { Product } from '../../../models/product';
import { Request, Response } from 'express'
import moment from 'moment';

export const updateDiscountOnProduct = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user;
      if (!_id) {
         return res.status(401).json({ message: "Unauthorized Access" })
      }
      const { _discountId, _productId } = req.query;
      const { discountType, discountValue, startDate, endDate } = req.body;
      const isNonEmpty = (field: any) => {
         if (typeof field === 'string') {
            return field.trim() !== '';
         }
         if (typeof field === 'number') {
            return !isNaN(field);  // Ensure it's a valid number
         }
         return false;
      };

      if (
         !isNonEmpty(discountType) ||
         !isNonEmpty(discountValue) ||
         !isNonEmpty(startDate) ||
         !isNonEmpty(endDate)
      ) {
         return res.status(400).json({ error: 'Field cannot be empty' });
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
      const product = await Product.findOne({ _id: _productId })
      if (discountValue > product.price) {
         return res.json({ message: 'Discount value can not be greater then the product price.' })
      }
      const discount = await Discount.findOne({ _id: _discountId })
      if (discountType || discountValue || startDate || endDate) {
         discount.discountType = discountType,
            discount.discountValue = discountValue,
            discount.startDate = startDate,
            discount.endDate = endDate
         await discount.save()
         return res.status(200).json({ success: true, message: 'Discount on product updated sussessfully', discount })
      } else
         return res.status(400).json({ error: 'Plase provide some fields to update' })
   } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
   }
}