import { logger } from "@/utils/logger";
import bcrypt from 'bcrypt';
import { User, UserModel } from "@/models/User";
import { convertToPagination, getPaginationParams } from "@/utils/helpers";
import { ObjectId } from "mongodb";
import { RoleModel } from '../modules/UserManagement/models/Role';
import { Constants } from '@/config/constants';

export interface RegistrationInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  roles?: string[];
  location?: any
}

interface LoginInput {
  email: string;
  password: string;
}

// @ts-ignore
interface GetUserInput {
  email: string;
}

interface ListUsersOptions {
  limit?: number;
  page?: number;
  filter?: { search?: string, roles?: ObjectId[] };
}


interface UpdateUserInput {
  userId: string;
  updates: Partial<User>;
}

export async function registerUser(userData: RegistrationInput) {
  const { name, email, password, phone, roles, location } = userData;
  
  try {
    // Check for existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Get role IDs from role names
    let roleIds: ObjectId[] = [];
    if (roles && roles.length > 0) {
      // If roles are provided, find them in the Role collection
      roleIds = await RoleModel.find({ 
        name: { $in: roles } 
      }).distinct('_id');
    } else {
      const defaultRole = await RoleModel.findOne({ 
        name: Constants.ROLES.USER 
      });
      if (defaultRole) {
        roleIds = [defaultRole._id];
      } else {
        const createdDefaultRole = await RoleModel.findOneAndUpdate(
          { name: Constants.ROLES.USER },
          { name: Constants.ROLES.USER, description: 'Default application user', permissions: [], isSystem: true, isActive: true },
          { upsert: true, new: true }
        );
        if (createdDefaultRole) {
          roleIds = [createdDefaultRole._id as any];
        }
      }
    }

    if (roleIds.length === 0) {
      const fallbackRole = await RoleModel.findOne({ name: { $in: [Constants.ROLES.USER, 'USER', 'user'] } });
      if (fallbackRole) {
        roleIds = [fallbackRole._id];
      }
    }

    if (roleIds.length === 0) {
      throw new Error('No valid roles found');
    }

    // Hash password if not already hashed
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role IDs
    const createdUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      roles: roleIds,
      location,
      courses: [],
      webinars: [],
      appliedJobs: [],
    });

    // Return user with populated roles
    return await UserModel.findById(createdUser._id)
      .populate('roles', 'name permissions');

  } catch (error) {
    logger.error('Error in registerUser:', error);
    throw error;
  }
}

export async function verifyLogin(loginData: LoginInput) {
  const { email, password } = loginData;
  const user = await UserModel.findOne({ email })
    .populate({
      path: 'roles',
      select: 'name permissions',
      populate: {
        path: 'permissions',
        select: 'code'
      }
    })
  ;
  console.log("verifyLogin 222", user?.roles[0].permissions);
  if (!user) {
    return {
      isValid: false,
      user: null
    }
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return {
      isValid: false,
      user: null
    }
  }
  return {
    isValid: true,
    user
  };
}


export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await UserModel.findOne({ email }).populate('roles', 'name permissions');
  return user;
}
export async function getUserById(id: string): Promise<User | null> {
  const user = await UserModel.findOne({ _id: new ObjectId(id) }).populate('roles', 'name permissions');
  return user;
}

export async function listUsers(options: ListUsersOptions) {
  const { limit = 10, page = 1, filter } = options;
  const query: any = {};
  const paginationData = getPaginationParams(limit, page)
  if (filter && filter.search) {
    const searchRegex = new RegExp(filter.search, 'i');
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  if(filter && filter.roles){
    query.roles = { $in: filter.roles.map(id => new ObjectId(id)) }
  }

  const skip = (page - 1) * limit;
  const users = await UserModel.find(query)
    .populate('roles', 'name permissions')
    .skip(skip)
    .limit(limit);
  const count = await UserModel.countDocuments(query);
  return convertToPagination(users, count, paginationData.limit, paginationData.offset);
}

export async function updateUser(userData: UpdateUserInput): Promise<User | null> {
  const { userId, updates } = userData;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, { new: true });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}


export async function me(userId: string) {
  const user = await UserModel.findOne({ _id: userId })
    .select(['name', 'email', 'phone', 'roles', 'profilePic', 'location'])
    .populate('roles', 'name permissions');
  return user;
}