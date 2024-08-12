import mongoose, { Document, model, Schema } from 'mongoose'

export interface IProduct extends Document {
   _createdBy: {
      _id: mongoose.Schema.Types.ObjectId,
      role: 'seller' | 'admin'
   };
   _category: mongoose.Schema.Types.ObjectId;
   _store?: mongoose.Schema.Types.ObjectId;
   name: string;
   price: number;
   mrp: number;
   image?: string;
   stock: number;
   discount?: mongoose.Schema.Types.ObjectId;
   discountedPrice: number;
   description?: string;
   isDeleted: boolean;
   isHotDeal: boolean;
   isBlocked: boolean;
   isAvailable: boolean;
}

const ProductSchema: Schema = new Schema({
   _createdBy: {
      _id: {
         type: Schema.Types.ObjectId,
      },
      role: {
         type: String,
         enum: ['seller', 'admin']
      }
   },
   _category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category'
   },
   _store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'store',
   },
   name: {
      type: String,
      required: true
   },
   discountedPrice: {
      type: Number,
      default: null
   },
   price: {
      type: Number,
      required: true,
   },
   mrp: {
      type: Number,
      required: true
   },
   image: {
      type: String,
   },
   stock: {
      type: Number,
      required: true
   },
   discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'discounts'
   },
   description: {
      type: String,
   },
   isBlocked: {
      type: Boolean,
      default: false
   },
   isHotDeal: {
      type: Boolean,
      default: false
   },
   isDeleted: {
      type: Boolean,
      default: false
   },
   isAvailable: {
      type: Boolean,
      default: true
   }
},
   {
      timestamps: true,
      versionKey: false
   })

export const Product = model<IProduct>("product", ProductSchema)