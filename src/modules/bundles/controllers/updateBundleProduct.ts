import { Request, Response } from 'express'
import { updateBundle } from './bundleController'

export const updateBundleProductSale = async (req: Request, res: Response) => {
   try {
      const bundleId = req.params.bundleId;
      const updateData = req.body;
      const updatedBundle = await updateBundle(bundleId, updateData);
      if (!updatedBundle) {
         return res.status(404).json({ message: 'Bundle not found' });
      }
      return res.status(200).json(updatedBundle);
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }
}