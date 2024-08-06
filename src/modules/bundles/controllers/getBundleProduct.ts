import { Request, Response } from 'express'
import { getBundleById } from './bundleController'

export const getBundleProductSale = async (req: Request, res: Response) => {
   try {
      const bundleId = req.params.bundleId;
      const bundle = await getBundleById(bundleId);
      if (!bundle) {
         return res.status(404).json({ message: 'Bundle not found' });
      }
      return res.status(200).json(bundle);
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }
}