import { Admin } from '../../models/admin'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { isValidDate, isValidEmail } from '../../core/utils'



export const registerAdmin = async (req: Request, res: Response) => {
   try {
      const { name, password, email, phone, countryCode, dob, role } = req.body
      const hashedPassword = await bcrypt.hash(password, 10)
      const existingAdmin = await Admin.findOne({
         $or: [{ email: email }, { phone: phone }, { name: name }],
      })
      if (existingAdmin) {
         if (existingAdmin.email === email) {
            return res.status(400).json({ error: 'Cannot use existing email' })
         }
         if (existingAdmin.phone === phone) {
            return res.status(400).json({ error: 'Cannot use existing phone' })
         }
         if (existingAdmin.name === name) {
            return res.status(400).json({ error: 'Cannot use existing username' })
         }
      }
      // Validate DOB using moment
      if (!isValidDate(dob)) {
         return res.status(400).json({ error: 'Invalid date of birth' })
      }

      // Validate email using Regex
      if (!isValidEmail(email)) {
         return res.status(400).json({ error: 'Invalid email format' })
      }
      const admin = await Admin.create({
         name,
         password: hashedPassword,
         email,
         phone,
         countryCode,
         dob,
         role,
      })
      return res.status(201).json({ user: "Admin Registered Successfully", _admin: admin._id })
   } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message })
   }
}