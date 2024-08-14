import moment from "moment"
import mongoose from 'mongoose';

export function generate_random_number(length: number) {
   let result = ''
   const characters = '0123456789'
   const charactersLength = characters.length
   for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
   }
   return result
}


export const otpExpire = new Date(Date.now() + 5 * 60 * 1000)



export const isValidDate = (dateString: string) => {
   return moment(dateString, 'YYYY-MM-DD', true).isValid()
}

// Validate email format
export const isValidEmail = (email: string): boolean => {
   if (typeof email !== 'string') return false;
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
};

// Validate mobile number (example format: +91-1234567890)
export const isValidMobileNumber = (mobile: string): boolean => {
   if (typeof mobile !== 'string') return false;
   const mobileRegex = /^\+\d{1,3}-\d{10}$/;
   return mobileRegex.test(mobile);
};

// Validate MongoDB ObjectId
export const isValidObjectId = (id: string): boolean => {
   return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
};

// Validate GST number (example format: 12ABCDE3456F1Z5)
export const isValidGSTNumber = (gst: string): boolean => {
   if (typeof gst !== 'string') return false;
   const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[Z][A-Z0-9]{1}$/;
   return gstRegex.test(gst);
};

// Validate license number (example format: AB1234567890123)
export const isValidLicenseNumber = (license: string): boolean => {
   if (typeof license !== 'string') return false;
   const licenseRegex = /^[A-Z]{2}[0-9]{13}$/;
   return licenseRegex.test(license);
};
