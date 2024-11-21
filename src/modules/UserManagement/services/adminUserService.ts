import { UserModel, User as IUser } from '../../../models/User';
import { RoleModel } from '../models/Role';
import { ListOptions, PaginatedList } from '@/types/custom';
import { Types } from 'mongoose';

export class AdminUserService {
  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = await UserModel.create(userData);
      return user.populate('roles');
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  static async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      ).populate('roles');
      return user;
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      await UserModel.findByIdAndDelete(userId);
    } catch (error: any) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  static async toggleUserStatus(userId: string, isActive: boolean): Promise<IUser | null> {
    try {
      return await UserModel.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true }
      ).populate('roles');
    } catch (error: any) {
      throw new Error(`Failed to toggle user status: ${error.message}`);
    }
  }

  static async assignRoles(userId: string, roleIds: string[]): Promise<IUser | null> {
    try {
      return await UserModel.findByIdAndUpdate(
        userId,
        { roles: roleIds },
        { new: true }
      ).populate('roles');
    } catch (error: any) {
      throw new Error(`Failed to assign roles: ${error.message}`);
    }
  }

  static async getAllUsers(options: ListOptions) {
    try {
      const { page = 1, limit = 10, search, sort } = options;
      const query: any = {};

      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ];
      }

      const users = await UserModel.find(query)
        .populate('roles')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort || { createdAt: -1 });

      const total = await UserModel.countDocuments(query);

      return {
        docs: users,
        total,
        page,
        limit
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }
} 