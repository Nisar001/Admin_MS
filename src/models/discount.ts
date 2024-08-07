import mongoose, { model, Schema } from 'mongoose'

export interface IAdminDiscounts extends Document {
   _admin: mongoose.Schema.Types.ObjectId;
   _store?: mongoose.Schema.Types.ObjectId
   _product: mongoose.Schema.Types.ObjectId[];
   discountType: string;
   discountValue: number;
   startDate: Date;
   endDate: Date;
}

const AdminDiscountSchema: Schema = new Schema({
   _admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
   },
   _store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'store',
   },
   _product: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'product',
         required: true
      }],
   discountType: {
      type: String,
   },
   discountValue: {
      type: Number
   },
   startDate: {
      type: Date
   },
   endDate: {
      type: Date
   }
}, {
   timestamps: true,
   versionKey: false
})

export const AdminDiscount = model<IAdminDiscounts>('admin_discount', AdminDiscountSchema)