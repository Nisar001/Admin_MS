import { Auth } from "../../../models/auth";
import { Request, Response } from "express";


export const toggleSeller = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user
      const { _sellerId } = req.query
      const toggle: boolean = req.body.toggle
      const seller = await Auth.findOne({ _id: _sellerId, role: 'seller' })
      if (!seller) {
         return res.status(400).json({ error: 'Seller Not Found' })
      }
      if (toggle) {
         seller.isBlocked = true
         await seller.save()
         return res.status(200).json({ message: 'Seller Blocked' })
      } else
         seller.isBlocked = false
      await seller.save()
      return res.status(200).json({ message: 'Seller unblocked' })
   } catch (error) {
      return res.status(500).json({ error: error.message })
   }
}