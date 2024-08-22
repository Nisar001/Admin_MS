import { Request, Response } from 'express';
import moment from 'moment';
import { Sale } from '../../../models/sale';
import { Product } from '../../../models/product';

// ... Existing functions

// Get All Sales with Pagination, Search, and Sorting
export const getAllSales = async (req: Request, res: Response) => {
   try {
      const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = '' } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const pageSize = parseInt(limit as string, 10);
      const sortBy = sort as string;
      const sortOrder = order === 'asc' ? 1 : -1;

      // Define search criteria
      const searchCriteria = search
         ? {
            $or: [
               { title: { $regex: search, $options: 'i' } },
               { description: { $regex: search, $options: 'i' } }
            ]
         }
         : {};

      // Get total count of sales matching the search criteria
      const totalSales = await Sale.countDocuments(searchCriteria);

      // Fetch sales with pagination, search, and sorting
      const sales = await Sale.find(searchCriteria)
         .populate('products.productId')
         .sort({ [sortBy]: sortOrder })
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize);

      return res.status(200).json({
         success: true,
         totalSales,
         totalPages: Math.ceil(totalSales / pageSize),
         currentPage: pageNumber,
         sales
      });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error });
   }
};
