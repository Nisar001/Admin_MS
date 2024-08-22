import { HotDeal } from "../../../models/hotDeals";
import { Request, Response } from "express";


export const toggleHotdeal = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user
      const { _hotdealId } = req.query
      const toggle: boolean = req.body.toggle
      const hotdeal = await HotDeal.findById({ _id: _hotdealId })
      if (!hotdeal) {
         return res.status(400).json({ error: 'Hot Deal Not Found' })
      }
      if (toggle) {
         hotdeal.isBlocked = true
         await hotdeal.save()
         return res.status(200).json({ message: 'Hot Deal Blocked' })
      } else
         hotdeal.isBlocked = false
      await hotdeal.save()
      return res.status(200).json({ message: 'Hot Deal unblocked' })
   } catch (error) {
      return res.status(500).json({ error: error.message })
   }
}