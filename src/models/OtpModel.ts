import mongoose, { Document, Schema } from 'mongoose';

interface OTP extends Document {
  userId: string;
  otp: string;
  expirationTime: Date;
  verified: boolean;
  deliveryMethod: string;
  action: string; // Field to store the action associated with the token
  token: string; // Field to store the token
}

const OTPSchema = new Schema<OTP>({
  userId: { type: String, unique: true },
  otp: String,
  expirationTime: Date,
  verified: { type: Boolean, default: false },
  deliveryMethod: String,
  action: String,
  token: String,
});

export const OTPModel = mongoose.model<OTP>('OTP', OTPSchema);
