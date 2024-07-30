import { Request, Response } from "express";
import { Category } from "../../../../models/category";
import { Admin } from "../../../../models/admin";

export const createCategory = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user
      const { categoryname } = req.body;
      const admin = await Admin.findById(_id)
      if (!admin) {
         return res.status(401).json({ message: 'Invalid User, You cannot create category... ' })
      }
      if ([categoryname].some((field: string) => field.trim() === '')) {
         return res.status(400).json({ error: 'Field cannot be empty' })
      }
      const existingCategory = await Category.findOne({ categoryname: categoryname })
      if (existingCategory) {
         return res.status(400).json({ message: 'Category is already exist...' })
      }
      const category = await Category.create({
         _admin: admin._id,
         categoryname: categoryname
      })
      return res.status(201).json({ message: 'Category Created', category })
   } catch (error) {
      return res.status(500).json({ error: error.message })
   }
}