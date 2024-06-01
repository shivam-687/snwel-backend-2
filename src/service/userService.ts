
import { logger } from "@/utils/logger";
import bcrypt from 'bcrypt';
import { User, UserModel } from "@/models/User";
import { convertToPagination, getPaginationParams } from "@/utils/helpers";
import { ObjectId } from "mongodb";

export interface RegistrationInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  roles: string[];
  location?: any
}

interface LoginInput {
  email: string;
  password: string;
}

interface GetUserInput {
  email: string;
}

interface ListUsersOptions {
  limit?: number;
  page?: number;
  filter?: { search?: string, roles?: string[] };
}


interface UpdateUserInput {
  userId: string;
  updates: Partial<User>;
}

export async function registerUser(userData: RegistrationInput) {
  const { name, email, password, phone, roles, location } = userData;
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await UserModel.create({
    name,
    email,
    password,
    phone,
    roles,
    location,
    courses: [],
    webinars: [],
    appliedJobs: [],
  });

  return createdUser;
}

export async function verifyLogin(loginData: LoginInput) {
  const { email, password } = loginData;
  const user = await UserModel.findOne({ email });
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
  const user = await UserModel.findOne({ email });
  return user;
}
export async function getUserById(id: string): Promise<User | null> {
  const user = await UserModel.findOne({ _id: new ObjectId(id) });
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
    query.roles = {$in: filter.roles}
  }

  const skip = (page - 1) * limit;
  const users = await UserModel.find(query).skip(skip).limit(limit);
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
  const user = await UserModel.findOne({ _id: userId }).select(['name', 'email', 'phone', 'roles', 'profilePic', 'location'])
  return user;
}