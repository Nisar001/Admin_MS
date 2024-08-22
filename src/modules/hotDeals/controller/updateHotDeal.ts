import { Request, Response } from 'express';
import moment from 'moment';
import { HotDeal } from '../../../models/hotDeals';
import { Product } from '../../../models/product';

export const updateHotDeal = async (req: Request, res: Response) => {
   try {
      const { _id, role } = req.user; // admin or seller id
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized Access' });
      }

      const { _hotdealId } = req.params;
      const { title, description, discount, startDate, endDate, product } = req.body;

      const isNonEmpty = (field: any) => {
         if (typeof field === 'string') {
            return field.trim() !== '';
         }
         if (typeof field === 'number') {
            return !isNaN(field); // Ensure it's a valid number
         }
         return false;
      };

      if (
         (title && !isNonEmpty(title)) ||
         (description && !isNonEmpty(description)) ||
         (discount && !isNonEmpty(discount)) ||
         (startDate && !isNonEmpty(startDate)) ||
         (endDate && !isNonEmpty(endDate))
      ) {
         return res.status(400).json({ error: 'Field cannot be empty' });
      }

      // Validate dates if provided
      if (startDate && endDate) {
         const start_date = moment(startDate, 'YYYY-MM-DD');
         const end_date = moment(endDate, 'YYYY-MM-DD');

         if (start_date.isAfter(end_date)) {
            return res.status(400).json({ error: 'Start Date cannot be greater than End Date' });
         }

         if (!start_date.isValid() || !end_date.isValid()) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
         }

         const today = moment().startOf('day');
         if (start_date.isBefore(today) || end_date.isBefore(today)) {
            return res.status(400).json({ error: 'Dates cannot be in the past.' });
         }
      }

      // Find existing hot deal
      const hotDeal = await HotDeal.findById(_hotdealId);
      if (!hotDeal) {
         return res.status(404).json({ message: 'Hot Deal not found' });
      }

      // Check if the user is authorized to update this hot deal
      if (hotDeal._createdBy._id.toString() !== _id.toString() && role !== 'admin') {
         return res.status(403).json({ message: 'Unauthorized Access' });
      }

      // Update the hot deal
      if (title) hotDeal.title = title;
      if (description) hotDeal.description = description;
      if (discount) {
         if (discount > 100 || discount < 0) {
            return res.status(400).json({ message: 'Invalid percentage value. Must be between 0 and 100.' });
         }
         hotDeal.discount = discount;
      }
      if (startDate) hotDeal.startDate = startDate;
      if (endDate) hotDeal.endDate = endDate;
      if (product) hotDeal.product = product;

      await hotDeal.save();

      // Update product hot deal price if discount is provided
      if (discount && product || discount && hotDeal.product) {
         const productDoc = await Product.findById(product);
         if (!productDoc) {
            return res.status(404).json({ message: 'Product not found' });
         }
         const discountedPrice = productDoc.mrp - (productDoc.mrp * (discount / 100));
         productDoc.HotDealPrice = discountedPrice;
         await productDoc.save();
      }

      return res.status(200).json({ success: true, message: 'Hot Deal updated successfully', hotDeal });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error });
   }
};
