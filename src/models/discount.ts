import mongoose, { model, Schema } from 'mongoose'

export interface IDiscounts extends Document {
   _seller: mongoose.Schema.Types.ObjectId;
   _store: mongoose.Schema.Types.ObjectId
   _product: mongoose.Schema.Types.ObjectId;
   discountType: string;
   discountValue: number;
   startDate: Date;
   endDate: Date;
}

const DiscountSchema: Schema = new Schema({
   _seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
   },
   _store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'store',
      required: true
   },
   _product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true
   },
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

export const Discount = model<IDiscounts>('discount', DiscountSchema)