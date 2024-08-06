import { Request, Response } from 'express'
import { getBundlesBySellerId } from './bundleController'

export const getAllBundleProductSale = async (req: Request, res: Response) => {
   try {
      const sellerId = req.params.sellerId;

      // Extract query parameters
      const search = req.query.search?.toString();
      const sortField = req.query.sortField?.toString() || 'name'; // Default sort field
      const sortOrder = (req.query.sortOrder?.toString() as 'desc'); // Default sort order
      const page = parseInt(req.query.page?.toString() || '1', 10); // Default to page 1
      const limit = parseInt(req.query.limit?.toString() || '10', 10); // Default to 10 items per page

      const { bundles, totalPages, perPage, currentPage, totalCount } = await getBundlesBySellerId(
         sellerId,
         search,
         sortField,
         sortOrder,
         page,
         limit
      );

      if (bundles.length === 0) {
         return res.status(404).json({ message: 'No bundles found' });
      }

      return res.status(200).json({
         bundles,
         totalPages,
         perPage,
         currentPage,
         totalCount
      });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }
}