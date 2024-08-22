import { Product } from '../../../models/product';
import { Bundle } from '../../../models/bundle';
import { Request, Response } from 'express'
import { isValidObjectId, Types } from 'mongoose';
import lo from 'lodash'

export const removeBundleProduct = async (req: Request, res: Response) => {
   try {
      const { _id } = req.user;
      const { bundleId, productId } = req.query;

      // Validate bundleId and productId
      if (!isValidObjectId(bundleId) || !isValidObjectId(productId)) {
         return res.status(400).json({ error: 'Invalid bundle or product ID.' });
      }

      // Convert productId to ObjectId
      const productObjectId = new Types.ObjectId(productId as string);

      // Find the bundle
      const bundle = await Bundle.findOne({ _id: bundleId, '_createdBy._id': _id });
      if (!bundle) {
         return res.status(400).json({
            error: 'Invalid bundle ID or you do not have permission to access this bundle.',
         });
      }
      if (bundle.isBlocked) {
         return res.status(400).json({
            error: 'This bundle has been blocked.',
         });
      }
      if (bundle.isDeleted) {
         return res.status(400).json({
            error: 'This bundle has been deleted by the owner.',
         });
      }

      // Check if the product exists in the bundle
      const productIndex = bundle._products.findIndex(
         (prodId) => prodId.toString() === productObjectId.toString()
      );
      if (productIndex === -1) {
         return res.status(400).json({ error: 'Product not found in the bundle.' });
      }

      // Remove the product from the bundle
      bundle._products.splice(productIndex, 1);

      // Recalculate the total price
      const remainingProducts = await Product.find({ _id: { $in: bundle._products } });

      const totalPrice = lo.sumBy(remainingProducts, 'price');

      // Apply the discount if it exists
      const finalPrice = bundle.discount
         ? totalPrice - (totalPrice * bundle.discount) / 100
         : totalPrice;
      bundle.price = finalPrice;

      // Save the updated bundle
      await bundle.save();

      return res.status(200).json({ success: true, data: bundle });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
   }
}