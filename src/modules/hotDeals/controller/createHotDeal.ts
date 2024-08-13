import { Request, Response } from 'express';
import moment from 'moment';
import { HotDeal } from '../../../models/hotDeals';
import { Product } from '../../../models/product';
import mongoose from 'mongoose';

export const createHotDeal = async (req: Request, res: Response) => {
   try {
      const { _id, role } = req.user; // admin or seller id
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized Access' });
      }

      const { _productId } = req.query;
      if (!_productId) {
         return res.status(404).json({ message: 'Productid is missing' });
      }

      const { title, description, discount, startDate, endDate } = req.body;

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
         !isNonEmpty(title) ||
         !isNonEmpty(description) ||
         !isNonEmpty(discount) ||
         !isNonEmpty(startDate) ||
         !isNonEmpty(endDate)
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

      // Check for existing discount on the product by this admin
      const existingHotDeal = await HotDeal.findOne({ '_createdBy._id': _id, title: title, product: _productId });
      if (existingHotDeal) {
         return res.status(409).json({ message: 'Hot Deal on Product is already added' });
      }

      const product = await Product.findOne({ _id: _productId })
      if (!product) {
         return res.json({ message: 'Product Not Found' })
      }
      // Calculate the discounted price based on discount type
      let discountedPrice: number;
      if (discount) {
         if (discount > 100 || discount < 0) {
            return res.status(400).json({ message: 'Invalid percentage value. Must be between 0 and 100.' });
         }
         discountedPrice = product.mrp - (product.mrp * (discount / 100));
      }

      // Create a new discount
      const hotDeal = await HotDeal.create({
         _createdBy: {
            _id: _id,
            role: role
         },
         title: title,
         description: description,
         discount: discount,
         startDate: startDate,
         endDate: endDate,
         product: _productId
      });

      // Update product with the discount and discounted price
      product.HotDealPrice = discountedPrice;
      await product.save();

      return res.status(200).json({ success: true, message: 'Product added in Hot Deal', hotDeal, discountedPrice });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error });
   }
};
