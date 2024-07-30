import { Request, Response } from 'express'
import { createBundle } from './bundleController'

export const createBundleProductSale = async (req: Request, res: Response) => {
   try {
      const bundleData = req.body;
      const bundle = await createBundle(bundleData);
      return res.status(201).json(bundle);
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }
}