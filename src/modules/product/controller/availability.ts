import { Request, Response } from 'express'
import { Product } from '../../../models/product'

export const availabilityStatus = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user
      const { _productId } = req.query
      const toggle: boolean = req.body.toggle
      const product = await Product.findById({ _id: _productId })
      if (!product) {
         return res.status(400).json({ error: 'Product Not Found' })
      }
      if (toggle) {
         product.isAvailable = true
         await product.save()
         return res.status(200).json({ message: "Product Availability Status Set to True" })
      } else
         product.isAvailable = false
      await product.save()
      return res.status(200).json({ message: 'Product Availability Status Set to False' })
   } catch (error) {
      return res.status(500).json({ error: error.message })
   }
}