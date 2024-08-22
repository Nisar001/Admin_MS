import { Request, Response } from "express";
import { Auth } from "../../../models/auth";

export const getUser = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user;
      if (!_id) {
         return res.status(401).json({ message: 'Unauthorized Access' })
      }
      const { _userId } = req.query
      const user = await Auth.findOne({ _id: _userId, role: 'user' }).select('-password')
      if (!user) {
         return res.status(404).json({
            succsess: false, message: 'User Not Found'
         })
      }
      return res.status(200).json({
         success: true, userDetails: user,
      })
   } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
   }
}