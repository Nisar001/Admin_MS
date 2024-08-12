import { Auth } from "../../../models/auth";
import { Request, Response } from "express";


export const toggleUser = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user
      const { _userId } = req.query
      const toggle: boolean = req.body.toggle
      const user = await Auth.findOne({ _id: _userId, role: 'user' })
      if (!user) {
         return res.status(400).json({ error: 'User Not Found' })
      }
      if (toggle) {
         user.isBlocked = true
         await user.save()
         return res.status(200).json({ message: 'User Blocked' })
      } else
         user.isBlocked = false
      await user.save()
      return res.status(200).json({ message: 'User unblocked' })
   } catch (error) {
      return res.status(500).json({ error: error.message })
   }
}