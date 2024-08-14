import { Sale } from "../../../models/sale";
import { Request, Response } from "express";


export const toggleSale = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user
      const { _saleId } = req.query
      const toggle: boolean = req.body.toggle
      const sale = await Sale.findById({ _id: _saleId })
      if (!sale) {
         return res.status(400).json({ error: 'Sale Not Found' })
      }
      if (toggle) {
         sale.isBlocked = true
         await sale.save()
         return res.status(200).json({ message: 'Sale Blocked' })
      } else
         sale.isBlocked = false
      await sale.save()
      return res.status(200).json({ message: 'Sale unblocked' })
   } catch (error) {
      return res.status(500).json({ error: error.message })
   }
}