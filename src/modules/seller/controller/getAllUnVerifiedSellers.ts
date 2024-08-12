import { Request, Response } from 'express';
import { Auth } from '../../../models/auth';

export const getUnVerifiedSellers = async (req: Request, res: Response) => {
   try {
      const { page = '1', limit = '10', search, sortField = 'username', sortOrder = 'asc' } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const pageSize = parseInt(limit as string, 10);
      const searchQuery = search as string;

      // Validate sortField and sortOrder
      const validSortFields = ['username', 'email', 'phone', 'countryCode', 'dob'];
      if (!validSortFields.includes(sortField as string)) {
         return res.status(400).json({ error: 'Invalid sort field' });
      }

      if (!['asc', 'desc'].includes(sortOrder as string)) {
         return res.status(400).json({ error: 'Invalid sort order' });
      }

      const sortOption: Record<string, 1 | -1> = { [sortField as string]: sortOrder === 'asc' ? 1 : -1 };

      const query: any = { role: 'seller', isVerified: false };

      if (searchQuery) {
         query.$or = [
            { username: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } },
            { phone: { $regex: searchQuery, $options: 'i' } },
         ];
      }

      const seller = await Auth.find(query)
         .select('-password')
         .sort(sortOption)
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize);

      const totalUsers = await Auth.countDocuments(query);

      return res.status(200).json({
         success: true,
         seller,
         totalPages: Math.ceil(totalUsers / pageSize),
         currentPage: pageNumber,
         totalUsers
      });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error });
   }
};
