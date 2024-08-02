import mongoose, { Schema, Document } from 'mongoose';

interface IBundle extends Document {
   name: string;
   products: { productId: string; quantity: number }[];
   price: number;
   sellerId: string;
   createdAt: Date;
   updatedAt: Date;
}

const BundleSchema: Schema = new Schema(
   {
      name: { type: String, required: true },
      products: [
         {
            productId: { type: Schema.Types.ObjectId, ref: 'product', required: true },
            quantity: { type: Number, required: true }
         }
      ],
      price: { type: Number, required: true },
      sellerId: { type: Schema.Types.ObjectId, ref: 'seller', required: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
   },
   { timestamps: true }
);

export const Bundle = mongoose.model<IBundle>('bundle', BundleSchema);