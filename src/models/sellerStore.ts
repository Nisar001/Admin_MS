import { Schema, model, Document } from 'mongoose';

export interface IStore extends Document {
   userId: Schema.Types.ObjectId;
   storeName: string;
   storeDescription?: string;
   isBlocked: boolean;
   GSTN: number;
   LICN: number;
   storeAddress?: IStoreAddress[];
}

export interface IStoreAddress {
   street: string;
   area: string;
   city: string;
   zipcode: string;
   state: string;
   country: string;
}


const StoreSchema = new Schema<IStore>({
   userId: {
      type: Schema.Types.ObjectId,
      ref: 'seller',
      required: true
   },
   storeName: {
      type: String,
      required: true,
      unique: true
   },
   storeDescription: {
      type: String,
      required: true
   },
   isBlocked: {
      type: Boolean,
      default: false
   },
   GSTN: {
      type: Number,
      required: true,
      unique: true
   },
   LICN: {
      type: Number,
      required: true,
      unique: true
   },
   storeAddress: [
      {
         street: {
            type: String,
         },
         area: {
            type: String,
         },
         city: {
            type: String,
         },
         zipcode: {
            type: String,
         },
         state: {
            type: String,
         },
         country: {
            type: String,
         },
      },
   ],
}, {
   timestamps: true,
   versionKey: false
});

export const Store = model<IStore>('store', StoreSchema);
