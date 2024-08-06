import { Discount } from '../../../models/discount';
import { Product } from '../../../models/product';
import { Request, Response } from 'express'
import moment from 'moment';

export const addDiscountOnProduct = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user // seller id
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized Access' })
      }
      const { _productId, _storeId } = req.query
      if (!_productId && _storeId) {
         return res.status(404).json({ message: 'Product id and Store id is missing' })
      }
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
      const existingDiscount = await Discount.findOne({ _seller: _id, _product: _productId })
      if (existingDiscount) {
         return res.status(409).json({ message: 'Discount on Product is already added' })
      }
      const product = await Product.findById({ _id: _productId })
      if (!product) {
         return res.status(404).json({ message: "Product not found" })
      }
      if (discountValue > product.price) {
         return res.json({ message: 'Discount value can not be greater then the product price.' })
      }
      const discount = await Discount.create({
         _seller: _id,
         _store: _storeId,
         _product: _productId,
         discountType: discountType,
         discountValue: discountValue,
         startDate: startDate,
         endDate: endDate
      })
      return res.status(200).json({ success: true, message: "Discount added on product", discount })
   } catch (error) {
      return res.status(500).json({ success: false, message: "Server Error", error })
   }
}