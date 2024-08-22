import { Request, Response } from "express";
import { Sale } from "../../../models/sale";
import { Product } from "../../../models/product";
import moment from "moment";

export const updateSale = async (req: Request, res: Response) => {
   try {
      const { _id, role } = req.user; // admin or seller id
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized Access' });
      }

      const { _saleId } = req.params;
      const { title, description, discount, startDate, endDate, products } = req.body;

      // Validate sale ID
      if (!_saleId) {
         return res.status(400).json({ error: 'Sale ID is required' });
      }

      // Validate inputs
      if (title && typeof title !== 'string') {
         return res.status(400).json({ error: 'Title must be a string' });
      }
      if (description && typeof description !== 'string') {
         return res.status(400).json({ error: 'Description must be a string' });
      }
      if (discount !== undefined) {
         if (typeof discount !== 'number' || discount < 0 || discount > 100) {
            return res.status(400).json({ error: 'Discount must be a number between 0 and 100' });
         }
      }
      if (startDate && !moment(startDate, 'YYYY-MM-DD', true).isValid()) {
         return res.status(400).json({ error: 'Invalid startDate format. Use YYYY-MM-DD.' });
      }
      if (endDate && !moment(endDate, 'YYYY-MM-DD', true).isValid()) {
         return res.status(400).json({ error: 'Invalid endDate format. Use YYYY-MM-DD.' });
      }

      // Validate date logic
      if (startDate && endDate) {
         const start_date = moment(startDate, 'YYYY-MM-DD');
         const end_date = moment(endDate, 'YYYY-MM-DD');

         if (start_date.isAfter(end_date)) {
            return res.status(400).json({ error: 'Start Date cannot be greater than End Date' });
         }

         const today = moment().startOf('day');
         if (start_date.isBefore(today) || end_date.isBefore(today)) {
            return res.status(400).json({ error: 'Dates cannot be in the past.' });
         }
      }

      // Find the sale
      const sale = await Sale.findById(_saleId);
      if (!sale) {
         return res.status(404).json({ message: 'Sale not found' });
      }

      // Check authorization
      if (sale.createdBy._id.toString() !== _id.toString() && role !== 'admin') {
         return res.status(403).json({ message: 'Unauthorized Access' });
      }

      // Update fields
      if (title) sale.title = title;
      if (description) sale.description = description;
      if (discount !== undefined) sale.discount = discount;
      if (startDate) sale.startDate = startDate;
      if (endDate) sale.endDate = endDate;

      // Validate and update products
      if (products) {
         if (!Array.isArray(products)) {
            return res.status(400).json({ error: 'Products must be an array' });
         }

         const productIds = products.map(p => p.productId);
         const productDocs = await Product.find({ '_id': { $in: productIds } });
         if (productDocs.length !== products.length) {
            return res.status(400).json({ error: 'Some product IDs are invalid' });
         }

         const updatedProducts = productDocs.map(product => {
            const productData = products.find(p => p.productId.toString() === product._id.toString());
            return {
               productId: product._id,
               salePrice: product.mrp - (product.mrp * (discount / 100)),
            };
         });

         sale.products = updatedProducts as any;
      }

      await sale.save();

      return res.status(200).json({ success: true, message: 'Sale updated successfully', sale });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error });
   }
};
