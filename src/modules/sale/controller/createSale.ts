import { Request, Response } from "express";
import { Sale } from "../../../models/sale";
import { Product } from "../../../models/product";
import moment from "moment";

export const createSale = async (req: Request, res: Response) => {
   try {
      const { _id, role } = req.user; // admin or seller id
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized Access' });
      }

      const { title, description, discount, startDate, endDate, products } = req.body;

      if (!title || !description || discount === undefined || !startDate || !endDate || !products) {
         return res.status(400).json({ error: 'All fields are required' });
      }

      const start_date = moment(startDate);
      const end_date = moment(endDate);

      if (!start_date.isValid() || !end_date.isValid()) {
         return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
      }

      if (start_date.isAfter(end_date)) {
         return res.status(400).json({ error: 'Start Date cannot be greater than End Date' });
      }

      const today = moment().startOf('day');
      if (start_date.isBefore(today) || end_date.isBefore(today)) {
         return res.status(400).json({ error: 'Dates cannot be in the past.' });
      }

      if (discount < 0 || discount > 100) {
         return res.status(400).json({ error: 'Discount must be between 0 and 100.' });
      }

      // Check if products exist and calculate sale prices
      const productDocs = await Product.find({ '_id': { $in: products.map(p => p.productId) } });
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

      // Create Sale
      const sale = new Sale({
         title,
         description,
         discount,
         startDate,
         endDate,
         products: updatedProducts,
         createdBy: {
            _id: _id,
            role: role
         }
      });

      await sale.save();

      return res.status(201).json({ success: true, message: 'Sale created successfully', sale });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error });
   }
}