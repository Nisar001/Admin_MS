import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { Admin } from '../models/admin'


interface JwtPayload {
   _id: string
   role: string
}

export const verify_token = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const token = req.headers?.authorization?.split(' ')[1]
      if (!token) {
         return res.status(401).json({ error: 'Invalid token' })
      }
      const decode = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
      const user = await Admin.findById(decode?._id).lean()
      if (!user) {
         return res.status(401).json({ error: 'Invalid user' })
      }

      req.user = user
      next()
   } catch (error) {
      res.status(500).json({ error: error.message })
   }
}