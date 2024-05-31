import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

// Define interfaces for TypeScript type checking
export interface User extends Document {
  name: string;
  email: string;
  password: string;
  profilePic: string;
  phone: string,
  location?: {
    addr?: string,
    state?: string,
    city?: string,
    country?: string
  },
  roles: string[]; // Assuming roles are stored as an array of strings
  isValidPassword: (password: string) => Promise<boolean>
}


const UserSchema = new Schema<User>({
  name: String,
  email: String,
  password: String,
  profilePic: String,
  phone: String,
  location: {type: {
    addr: String,
    state: String,
    city: String,
    country: String
  }},
  roles: {type: [String], default: ['USER']},
});

UserSchema.pre(
  'save',
  async function (next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);
    console.log("Hash password called")
    this.password = hash;
    next();
  }
);

UserSchema.methods.isValidPassword = async function (password: string) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}



export const UserModel = mongoose.model<User>('User', UserSchema);