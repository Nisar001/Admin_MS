import { Request, Response } from "express";
import { Auth } from "../../../models/auth";

export const getSeller = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user;
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized Access' })
      }
      const { _userId } = req.query
      const user = await Auth.findOne({ _id: _userId, role: 'seller' }).select('-password')
      if (!user) {
         return res.status(404).json({
            succsess: false, message: 'Seller Not Found'
         })
      }
      return res.status(200).json({
         success: true, sellerDetails: user,
      })
   } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
   }
}