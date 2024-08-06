import { Request, Response } from "express";
import { Product } from "../../../models/product";

export const addProduct = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user;
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized User' })
      }
      const { _category, _store } = req.query
      const { name, price, mrp, description } = req.body
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
         !isNonEmpty(name) ||
         !isNonEmpty(price) ||
         !isNonEmpty(mrp) ||
         !isNonEmpty(description)
      ) {
         return res.status(400).json({ error: 'Field cannot be empty' });
      }
      if (!name) {
         return res.json({ message: 'Product Name is Required' })
      }
      if (!price) {
         return res.json({ message: 'Product Price is Required' })
      }
      if (!mrp) {
         return res.json({ message: 'Product MRP is Required' })
      }
      const existingProduct = await Product.findOne({ _category: _category, _store: _store, name: name })
      if (existingProduct) {
         return res.status(409).json({ message: 'Item found...' })
      }
      const product = await Product.create({
         _seller: _id,
         _category: _category,
         _store: _store,
         name: name,
         price: price,
         mrp: mrp,
         description: description
      })
      return res.status(201).json({
         success: true,
         message: "Product Added Successfully",
         product: {
            ProductId: product._id,
            productName: product.name,
            productPrice: product.price,
            productMRP: product.mrp,
            ProductDescription: product.description
         }
      })
   } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
   }
}