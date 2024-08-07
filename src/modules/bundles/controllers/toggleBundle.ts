import { Request, Response } from 'express'
import { Bundle } from '../../../models/bundle'

export const toggleBundle = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user
      const { _bundleId } = req.query
      const toggle: boolean = req.body.toggle
      const bundle = await Bundle.findById({ _id: _bundleId })
      if (!bundle) {
         return res.status(400).json({ error: 'Bundle Not Found' })
      }
      if (toggle) {
         bundle.isBlocked = true
         await bundle.save()
         return res.status(200).json({ message: 'Bundle Blocked' })
      } else
         bundle.isBlocked = false
      await bundle.save()
      return res.status(200).json({ message: 'Bundle unblocked' })
   } catch (error) {
      return res.status(500).json({ error: error.message })
   }
}