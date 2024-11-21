import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IRole } from '../modules/UserManagement/models/Role';

// Define interfaces for TypeScript type checking
export interface User extends Document {
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  phone?: string,
  location?: {
    addr?: string,
    state?: string,
    city?: string,
    country?: string
  },
  roles: IRole['_id'][];
  isActive: boolean;
  lastLogin?: Date;
  isValidPassword: (password: string) => Promise<boolean>
}


const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: String,
  phone: String,
  location: {
    addr: String,
    state: String,
    city: String,
    country: String
  },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

UserSchema.pre(
  'save',
  async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  }
);

UserSchema.methods.isValidPassword = async function (password: string) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}



export const UserModel = mongoose.model<User>('User', UserSchema);