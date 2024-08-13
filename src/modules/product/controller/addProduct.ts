import { Request, Response } from "express";
import { Product } from "../../../models/product";

export const addProduct = async (req: Request, res: Response) => {
   try {
      const { _id, role } = req.user;
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized User' });
      }

      const { _category, _store } = req.query;
      const { name, price, mrp, description, stock, isAvailable } = req.body;

      // Utility function to check non-empty fields
      const isNonEmpty = (field: any) => {
         if (typeof field === 'string') {
            return field.trim() !== '';
         }
         if (typeof field === 'number') {
            return !isNaN(field) && field >= 0;  // Ensure it's a valid non-negative number
         }
         if (typeof field === 'boolean') {
            return true;  // Boolean is always valid if it is a boolean
         }
         return false;
      };

      // Validate required fields
      if (
         !isNonEmpty(name) ||
         !isNonEmpty(price) ||
         !isNonEmpty(mrp) ||
         !isNonEmpty(description) ||
         !isNonEmpty(stock) ||
         !isNonEmpty(isAvailable)
      ) {
         return res.status(400).json({ error: 'Fields cannot be empty' });
      }

      if (typeof name !== 'string') return res.status(400).json({ message: 'Product Name must be a string' });
      if (typeof price !== 'number') return res.status(400).json({ message: 'Product Price must be a number' });
      if (typeof mrp !== 'number') return res.status(400).json({ message: 'Product MRP must be a number' });
      if (typeof stock !== 'number') return res.status(400).json({ message: 'Product Stock must be a number' });
      if (typeof isAvailable !== 'boolean') return res.status(400).json({ message: 'Product Availability must be a boolean' });

      // Check if product already exists
      const existingProduct = await Product.findOne({ _store, name });
      if (existingProduct) {
         return res.status(409).json({ message: 'Item already exists in the store' });
      }

      // Create new product
      const product = await Product.create({
         _createdBy: {
            _id: _id,
            role: role
         },
         _category: _category,
         _store: _store,
         name: name,
         price: price,
         mrp: mrp,
         description: description,
         stock: stock,
         isAvailable: isAvailable
      });

      return res.status(201).json({
         success: true,
         message: "Product Added Successfully",
         product
      });
   } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
   }
};
