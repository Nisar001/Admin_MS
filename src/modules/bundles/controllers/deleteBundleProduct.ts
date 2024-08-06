import { Request, Response } from 'express'
import { deleteBundle } from './bundleController'

export const deleteBundleProductSale = async (req: Request, res: Response) => {
   try {
      const bundleId = req.params.bundleId;
      const deletedBundle = await deleteBundle(bundleId);
      if (!deletedBundle) {
         return res.status(404).json({ message: 'Bundle not found' });
      }
      return res.status(200).json({ message: 'Bundle deleted successfully' });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }
}