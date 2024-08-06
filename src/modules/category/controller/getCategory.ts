import { Category } from "../../../models/category";
import { Request, Response } from "express";

export const getCategoryById = async (req: Request, res: Response) => {
   try {
      const _id = req.user;
      const { id } = req.query
      if (!_id) {
         return res.status(403).json({ message: 'Unauthorized Access.' })
      }
      if (!id) {
         return res.status(400).json({ message: 'Please Provide the Category Id.' })
      }
      const category = await Category.findById({ _id: id })
      if (!category) {
         return res.status(404).json({ message: 'Category not found.' })
      } else
         return res.status(200).json({ messgae: 'Categoty found', category })
   } catch (error) {
      return res.status(500).json({ error: error.message })
   }
}