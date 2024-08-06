import { Request, Response } from "express";
import { Product } from "../../../models/product";

export const updateProduct = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user;
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized access' })
      }
      const { _productId } = req.query
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
         return res.status(400).json({ success: false, error: 'Field cannot be empty' });
      }
      const product = await Product.findById({ _id: _productId })
      if (name || price || description) {
         product.name = name
         product.price = price
         product.mrp = mrp
         product.description = description
         await product.save()
         return res.status(200).json({
            succsess: true,
            message: 'Product Updated...', product: {
               product: product
            }
         })
      }
      return res.status(400).json({ success: false, message: 'Please Provide some field to update' })
   } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
   }
}