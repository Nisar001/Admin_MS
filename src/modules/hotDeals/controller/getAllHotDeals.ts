import { Request, Response } from 'express'
import { HotDeal } from '../../../models/hotDeals'

export const getAllHotDeals = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user; // user id 
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized Access' })
      }
      //const {page=1, limit=10, name} = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const name = req.query.name as string;

      const query = name
         ? { title: { $regex: name, $options: 'i' } }
         : {};

      const hotDeals = await HotDeal.find(query).populate('product')
         .skip((page - 1) * limit)
         .limit(limit);

      if (hotDeals.length === 0) {
         return res.json({ message: 'No Hot Deals, Please Create' });
      }

      const total = await HotDeal.countDocuments(query);

      return res.status(200).json({
         success: true,
         total,
         page,
         totalPages: Math.ceil(total / limit),
         hotDeals,
      });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error: error.message })
   }
}