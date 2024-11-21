import { UserModel, User as IUser } from '../../../models/User';
import { RoleModel } from '../models/Role';

export class ClientUserService {
  static async getProfile(userId: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(userId)
        .populate('roles')
        .select('-password')
        .lean();
      
      return user as IUser | null;
    } catch (error: any) {
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  }

  static async updateProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      // Prevent updating sensitive fields
      const allowedUpdates = ['name', 'phone', 'location', 'profilePic'];
      const sanitizedData = Object.keys(updateData)
        .filter(key => allowedUpdates.includes(key))
        .reduce((obj: Partial<IUser>, key: string) => {
          obj[key as keyof IUser] = updateData[key as keyof IUser];
          return obj;
        }, {} as Partial<IUser>);

      return (await UserModel.findByIdAndUpdate(
        userId,
        sanitizedData,
        { new: true }
      ).select('-password')) as IUser | null;
    } catch (error: any) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) throw new Error('User not found');

      const isValid = await user.isValidPassword(oldPassword);
      if (!isValid) throw new Error('Invalid current password');

      user.password = newPassword;
      await user.save();
    } catch (error: any) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }

  static async deleteAccount(userId: string, password: string): Promise<void> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) throw new Error('User not found');

      const isValid = await user.isValidPassword(password);
      if (!isValid) throw new Error('Invalid password');

      await UserModel.findByIdAndDelete(userId);
    } catch (error: any) {
      throw new Error(`Failed to delete account: ${error.message}`);
    }
  }
} 