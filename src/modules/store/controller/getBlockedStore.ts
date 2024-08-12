import { Request, Response } from 'express';
import { Store } from '../../../models/sellerStore';

export const getBlockedStores = async (req: Request, res: Response) => {
   try {
      const { page = '1', limit = '10', search, sortField = 'storeName', sortOrder = 'asc' } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const pageSize = parseInt(limit as string, 10);
      const searchQuery = search as string;

      // Validate sortField and sortOrder
      const validSortFields = ['storeName', 'storeDescription'];
      if (!validSortFields.includes(sortField as string)) {
         return res.status(400).json({ error: 'Invalid sort field' });
      }

      if (!['asc', 'desc'].includes(sortOrder as string)) {
         return res.status(400).json({ error: 'Invalid sort order' });
      }

      const sortOption: Record<string, 1 | -1> = { [sortField as string]: sortOrder === 'asc' ? 1 : -1 };

      const query: any = { isBlocked: true };

      if (searchQuery) {
         query.$or = [
            { storeName: { $regex: searchQuery, $options: 'i' } },
            { storeDescription: { $regex: searchQuery, $options: 'i' } },
         ];
      }

      const stores = await Store.find(query)
         .select('-GSTN -LICN')  // Exclude GSTN and LICN from the response
         .sort(sortOption)
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize);

      const totalStores = await Store.countDocuments(query);

      return res.status(200).json({
         success: true,
         stores,
         totalPages: Math.ceil(totalStores / pageSize),
         currentPage: pageNumber,
         totalStores
      });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error });
   }
};
