import { Request, Response } from "express";
import { HotDeal } from "../../../models/hotDeals";

export const getHotDeal = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user;
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized Access' })
      }
      const { _hotdealId } = req.query
      const hotdeal = await HotDeal.findById({ _id: _hotdealId })
      if (!hotdeal) {
         return res.status(404).json({
            succsess: false, message: 'Hot Deal Not Found'
         })
      }
      return res.status(200).json({
         success: true, hotdeal
      })
   } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
   }
}