import { Request, Response } from "express";
import { Category } from "../../../models/category";

export const deleteCategory = async (req: Request, res: Response) => {
   try {
      const _id = req.user
      if (!_id) {
         return res.status(403).json({ message: 'Unauthorized Access.' })
      }
      const { id } = req.query;
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
         res.status(404).send({ message: 'Category not found' });
         return;
      }
      res.status(200).send({ message: 'Category deleted successfully' });
   } catch (error) {
      return res.status(500).json({ error: error.message })

   }
}