import { Request, Response } from "express";
import { Sale } from "../../../models/sale";
import { Product } from "../../../models/product";
import moment from "moment";

export const deleteSale = async (req: Request, res: Response) => {
   try {
      const { _saleId } = req.params;

      const sale = await Sale.findById(_saleId);
      if (!sale) {
         return res.status(404).json({ message: 'Sale not found' });
      }

      await Sale.findByIdAndDelete(_saleId);

      return res.status(200).json({ success: true, message: 'Sale deleted successfully' });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error });
   }
};