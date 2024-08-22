import { Schema, model, Document } from 'mongoose';

export interface IHotDeal extends Document {
   title: string;
   description: string;
   discount: number;
   startDate: Date;
   endDate: Date;
   product: Schema.Types.ObjectId;
   isBlocked: boolean;
   _createdBy: {
      _id: Schema.Types.ObjectId,
      role: 'seller' | 'admin'
   }
}

const HotDealSchema = new Schema<IHotDeal>({
   title: { type: String, required: true },
   description: { type: String, required: true },
   discount: { type: Number, required: true },
   startDate: { type: Date, required: true },
   endDate: { type: Date, required: true },
   product: { type: Schema.Types.ObjectId, ref: 'products' }, // Reference to Product schema
   isBlocked: { type: Boolean, default: false },
   _createdBy: {
      _id: {
         type: Schema.Types.ObjectId,
         required: true,
      },
      role: {
         type: String,
         enum: ['seller', 'admin']
      }
   }
});

export const HotDeal = model<IHotDeal>('HotDeal', HotDealSchema);
