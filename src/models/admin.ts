import { Document, Schema, model } from 'mongoose'

export interface IAdmin extends Document {
   name: string
   password: string
   email: string
   phone: string
   countryCode: string
   isEmailVerified: boolean
   isPhoneVerified: boolean
   isVerified: boolean
   isActive: boolean
   authMethod: 'email' | 'phone' | 'authenticator'
   isTwoFAEnabled?: boolean
   resetPasswordToken?: string
   address?: [object]
   role: string
   dob: Date
   tempEmail?: string
   tempPhone?: string
   tempCountryCode?: string
}

const AdminSchema: Schema = new Schema<IAdmin>(
   {
      name: {
         type: String,
         required: true,
         unique: true,
         toLowerCase: true,
      },
      password: {
         type: String,
         required: true,
         toLowerCase: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         toLowerCase: true,
      },
      phone: {
         type: String,
         required: true,
         unique: true,
      },
      countryCode: {
         type: String,
         required: true,
      },
      isVerified: {
         type: Boolean,
         default: false,
      },
      isActive: {
         type: Boolean,
         default: false,
      },
      isEmailVerified: {
         type: Boolean,
         default: false,
      },
      isPhoneVerified: {
         type: Boolean,
         default: false,
      },
      authMethod: {
         type: String,
         enum: ['email', 'phone', 'authenticator'],
         default: 'email',
      },
      isTwoFAEnabled: {
         type: Boolean,
         default: false,
      },
      resetPasswordToken: {
         type: String,
         default: undefined,
      },
      address: [
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
      role: {
         type: String,
         default: 'admin',
      },
      dob: {
         type: Date,
         required: true,
      },
      tempEmail: { type: String },
      tempPhone: { type: String },
      tempCountryCode: { type: String },
   },
   {
      timestamps: true,
      versionKey: false,
   }
)


export const Admin = model<IAdmin>('admin', AdminSchema)