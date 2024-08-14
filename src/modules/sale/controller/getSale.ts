import { Request, Response } from "express";
import { Sale } from "../../../models/sale";
import { Product } from "../../../models/product";
import moment from "moment";

export const getSale = async (req: Request, res: Response) => {
   try {
      const { _saleId } = req.params;

      const sale = await Sale.findById(_saleId).populate('products.productId');
      if (!sale) {
         return res.status(404).json({ message: 'Sale not found' });
      }

      return res.status(200).json({ success: true, sale });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error });
   }
};