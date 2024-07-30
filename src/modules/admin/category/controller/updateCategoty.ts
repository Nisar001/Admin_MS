import { Category } from '../../../../models/category';
import { Request, Response } from 'express'

export const updateCategory = async (req: Request, res: Response) => {
   try {
      const _id = req.user;
      const categoryId = req.params;
      const { categoryname } = req.body;
      if (!_id) {
         return res.status(401).json({ message: "Unauthorized Access" })
      }

      if ([categoryname].some((field: string) => field.trim() === '')) {
         return res.status(400).json({ error: 'Field cannot be empty' })
      }
      const category = await Category.findById(categoryId)
      if (!category) {
         return res.status(404).json({ message: 'Category not found' })
      }
      if (categoryname) {
         category.categoryname = categoryname
         await category.save()
         return res.status(200).json({ message: 'Discount on product updated sussessfully', category })
      } else
         return res.status(400).json({ error: 'Plase provide field to update' })
   } catch (error) {
      return res.status(500).json({ error: error.message })
   }
}