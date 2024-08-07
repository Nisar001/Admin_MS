import { Request, Response } from "express";
import { Product } from "../../../models/product";
import { AdminDiscount } from "../../../models/discount";

export const deleteProduct = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user // productId
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized' });
      }
      const { _productId } = req.query
      const product = await Product.findOne({ _id: _productId })
      if (!product) {
         return res.json({ message: "Product not found" })
      }
      const delProdDis = await AdminDiscount.findOne({ _product: _productId })
      if (delProdDis) {
         await AdminDiscount.findOneAndDelete({ _product: _productId })
         await Product.findByIdAndDelete({ _id: _productId });
         return res.status(200).json({ message: 'Product and applied discount deleted successfully' })
      }
      await Product.findByIdAndDelete({ _id: _productId });
      return res.status(200).json({ success: true, message: "Product deleted successfully" })
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error });
   }
}