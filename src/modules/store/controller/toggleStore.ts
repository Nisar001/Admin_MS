import { Store } from "../../../models/sellerStore";
import { Request, Response } from "express";


export const toggleStore = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user
      const { _storeId } = req.query
      const toggle: boolean = req.body.toggle
      const store = await Store.findById({ _id: _storeId })
      if (!store) {
         return res.status(400).json({ error: 'Store Not Found' })
      }
      if (toggle) {
         store.isBlocked = true
         await store.save()
         return res.status(200).json({ message: 'Store Blocked' })
      } else
         store.isBlocked = false
      await store.save()
      return res.status(200).json({ message: 'Store unblocked' })
   } catch (error) {
      return res.status(500).json({ error: error.message })
   }
}