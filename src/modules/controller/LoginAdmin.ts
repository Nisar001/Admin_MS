import { Admin } from '../../models/admin'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { isValidEmail } from '../../core/utils'
import { generate_token } from '../../helpers/jwtHelper'
import jwt from 'jsonwebtoken'

export const loginAdmin = async (req: Request, res: Response) => {
   try {
      const { email, password } = req.body
      // Validate email using Regex
      if (!isValidEmail(email)) {
         return res.status(400).json({ error: 'Invalid email format' })
      }
      const admin = await Admin.findOne({ email: email })
      if (!admin) {
         return res.status(400).json({ error: 'You are not  Resistered' })
      }
      const valid_password = await bcrypt.compare(password, admin.password)
      if (!valid_password) {
         return res.status(400).json({ error: 'Invalid credentials!' })
      }
      const payload = {
         _id: admin._id.toString(),
         role: admin.role,
      }
      const token = generate_token(payload)
      return res.status(200).json({ succsess: true, _id: admin._id, token })

   }
   catch (error) {
      return res.status(500).json({ message: error.message })
   }
}