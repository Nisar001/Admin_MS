import { Request, Response } from 'express';
import { Auth } from '../../../models/auth';
import mongoose from 'mongoose';

export const getAllSellers = async (req: Request, res: Response) => {
   try {
      // Destructure and validate query parameters
      const { page = '1', limit = '10', search = '', sortField = 'username', sortOrder = 'asc' } = req.query;

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

      // Construct the sort option
      const sortOption: Record<string, 1 | -1> = { [sortField as string]: sortOrder === 'asc' ? 1 : -1 };

      // Build the query with regex for searching
      const query: any = { role: 'seller' }; // Filter by role 'user'

      if (searchQuery) {
         query.$or = [
            { username: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } },
            { phone: { $regex: searchQuery, $options: 'i' } },
         ];
      }

      // Fetch users with pagination, sorting, and excluding the password field
      const seller = await Auth.find(query)
         .select('-password') // Exclude the password field
         .sort(sortOption)
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize);

      // Get the total count of users matching the query
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
