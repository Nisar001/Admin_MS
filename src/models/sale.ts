import mongoose, { Document, Schema } from 'mongoose';

export interface ISale extends Document {
   title: string;
   description: string;
   discount: number;
   startDate: Date;
   endDate: Date;
   isBlocked: boolean;
   products: {
      productId: mongoose.Schema.Types.ObjectId;
      salePrice: number;
   }[];
   createdBy: {
      _id: mongoose.Schema.Types.ObjectId;
      role: string;
   };
}

const saleSchema: Schema<ISale> = new Schema({
   title: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   discount: {
      type: Number,
      required: true,
      min: [0, 'Discount must be at least 0%'],
      max: [100, 'Discount must be at most 100%'],
   },
   startDate: {
      type: Date,
      required: true,
   },
   endDate: {
      type: Date,
      required: true,
   },
   isBlocked: {
      type: Boolean,
      default: false
   },
   products: [{
      productId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'product',
         required: true,
      },
      salePrice: {
         type: Number,
         required: true,
      }
   }],
   createdBy: {
      _id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      role: {
         type: String,
         required: true,
      },
   },
}, {
   timestamps: true,
});

export const Sale = mongoose.model<ISale>('Sale', saleSchema);

