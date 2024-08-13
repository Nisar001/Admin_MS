import { Request, Response } from 'express';
import moment from 'moment';
import { AdminDiscount } from '../../../models/discount';
import { Product } from '../../../models/product';

export const updateDiscountOnProduct = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user; // Admin or seller id
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized Access' });
      }

      const { _discountId, _productId } = req.query;
      if (!_discountId || !_productId) {
         return res.status(400).json({ message: 'Discount id and Product id are required' });
      }

      const { discountType, discountValue, startDate, endDate } = req.body;

      // Utility function to check non-empty fields
      const isNonEmpty = (field: any) => {
         if (typeof field === 'string') {
            return field.trim() !== '';
         }
         if (typeof field === 'number') {
            return !isNaN(field) && field >= 0; // Ensure it's a valid non-negative number
         }
         if (typeof field === 'boolean') {
            return true; // Boolean is always valid if it is a boolean
         }
         return false;
      };

      if (
         (discountType !== undefined && !isNonEmpty(discountType)) ||
         (discountValue !== undefined && !isNonEmpty(discountValue)) ||
         (startDate !== undefined && !isNonEmpty(startDate)) ||
         (endDate !== undefined && !isNonEmpty(endDate))
      ) {
         return res.status(400).json({ error: 'Field cannot be empty' });
      }

      // Validate startDate and endDate
      if (startDate && endDate) {
         const start_date = moment(startDate, 'YYYY-MM-DD');
         const end_date = moment(endDate, 'YYYY-MM-DD');

         if (start_date.isAfter(end_date)) {
            return res.status(400).json({ error: 'startDate cannot be greater than endDate' });
         }

         if (!start_date.isValid() || !end_date.isValid()) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
         }

         const today = moment().startOf('day');
         if (start_date.isBefore(today) || end_date.isBefore(today)) {
            return res.status(400).json({ error: 'Dates cannot be in the past.' });
         }
      }

      // Check if the discount exists
      const discount = await AdminDiscount.findById(_discountId);
      if (!discount) {
         return res.status(404).json({ message: 'Discount not found' });
      }

      // Check if the product exists
      const product = await Product.findById(_productId);
      if (!product) {
         return res.status(404).json({ message: 'Product not found' });
      }

      // Update discount fields
      if (discountType !== undefined) discount.discountType = discountType;
      if (discountValue !== undefined) discount.discountValue = discountValue;
      if (startDate !== undefined) discount.startDate = startDate;
      if (endDate !== undefined) discount.endDate = endDate;

      await discount.save();

      // Update product's discounted price
      let discountedPrice: number;
      if (discountType === 'percent') {
         if (discountValue > 100 || discountValue < 0) {
            return res.status(400).json({ message: 'Invalid percentage value. Must be between 0 and 100.' });
         }
         discountedPrice = product.mrp - (product.mrp * (discountValue / 100));
      } else if (discountType === 'price') {
         if (discountValue > product.mrp || discountValue < 0) {
            return res.status(400).json({ message: 'Discount value cannot be greater than the MRP or negative.' });
         }
         discountedPrice = product.mrp - discountValue;
      } else {
         return res.status(400).json({ message: 'Invalid discount type.' });
      }

      product.discountedPrice = discountedPrice;
      product.discount = discount._id as any;

      await product.save();

      return res.status(200).json({
         success: true,
         message: 'Discount on product updated successfully',
         discount,
         discountedPrice
      });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
   }
};
