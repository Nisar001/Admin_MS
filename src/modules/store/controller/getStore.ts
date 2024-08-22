import { Request, Response } from 'express';
import { Store } from '../../../models/sellerStore';
import mongoose from 'mongoose';

export const getStoreById = async (req: Request, res: Response) => {
   try {
      const { storeId } = req.params;

      if (!storeId) {
         return res.status(400).json({ error: 'Store ID is required' });
      }

      // Validate that storeId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(storeId)) {
         return res.status(400).json({ error: 'Invalid Store ID format' });
      }

      const store = await Store.findById(storeId)
         .select('-GSTN -LICN');  // Exclude GSTN and LICN from the response

      if (!store) {
         return res.status(404).json({ error: 'Store not found' });
      }

      return res.status(200).json({
         success: true,
         store
      });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error });
   }
};
