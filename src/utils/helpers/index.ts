import { FilterOptions, ListOptions } from '@/types/custom';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { SQL } from 'drizzle-orm';
import { PgColumn, PgSelect } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { Constants } from '@/config/constants';
import {Request} from 'express'
import { Model } from 'mongoose';
import slugify from 'slugify';



export async function hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

export async function validatedPassword(plainPassword: string, hash: string) {
    return bcrypt.compare(plainPassword, hash)
}

export function parseErrorMessage(error: Error): { status: number, message: string } {
    const errorMessage: string = error.message;

    // Check if the error message follows a specific format
    const regex = /Error\: (\d+)\:(.*)/;
    const match = errorMessage.match(regex);

    if (match && match.length === 3) {
        const statusCode: number = parseInt(match[1]);
        const errorMessage: string = match[2];

        return { status: statusCode, message: errorMessage };
    } else {
        // If the string format is not found, return default 500 status
        return { status: 500, message: error.message };
    }
}


export function withPagination<T extends PgSelect>(
    qb: T,
    orderByColumn: PgColumn | SQL | SQL.Aliased,
    page = 1,
    pageSize = 10,
) {
    return qb
        .orderBy(orderByColumn)
        .limit(pageSize)
        .offset((page - 1) * pageSize);
}


export const getPaginationParams = (limit: number = 20, page: number = 1) => {
    // Calculate offset based on page number and limit
    limit = Number(limit);
    page = Number(page)
    const offset = (page - 1) * limit;
    return { limit, offset, page};
}

export const convertToPagination = (data: any[], total: number, limit: number = 20, page: number = 1) => {
  const offset = Math.max((page - 1) * limit, 0);
    const nextPage = page < Math.ceil(total / limit) ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;
    const hasNext = nextPage !== null;
    const currentPage = page;

    console.log(total)
    return {
        docs: data,
        limit: limit,
        offset: offset,
        total: total,
        nextPage: nextPage,
        prevPage: prevPage,
        hasNext: hasNext,
        currentPage: currentPage
    };
};


// Function to generate a token with action
export function generateToken(action: string): string {
    // Generate a unique token using UUID (Universally Unique Identifier)
    const token = uuidv4();
    return token + '|' + action; // Concatenate token with action using a separator
}

// Function to decrypt token and extract action
export function decryptToken(token: string): string | null {
    // Split the token using the separator '|'
    const parts = token.split('|');
    if (parts.length === 2) {
        // Return the action part of the token
        return parts[1];
    }
    return null; // Return null if the token format is invalid
}



export function generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

export function generateOTPObject({length=6}: {length?: number}){
    const expiry = dayjs(Date.now()).add(1, 'year').toDate();
    return {
        otp: generateOTP(length),
        expirationTime: expiry,
        verified: false,
    }
}

export function generateJwtToken(payload: any){
    return jwt.sign(payload, Constants.TOKEN_SECRET, {expiresIn: '1y'})
}


 export const getFilterQuery = (options: FilterOptions) => {
    const { filter } = options;
    const query: any = {};
    if (filter && filter.search) {
      const searchRegex = new RegExp(filter.search, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }]; // Assuming you're searching by name and email, you can adjust this accordingly
    }
    return query;
  };


  export function generateRandomPassword(length?: number): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let password = "";
    
    for (let i = 0; i < (length || 10); i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    return password;
  }


  
export const extractListOptions = (req: Request): ListOptions => {
    const { limit, page, search, ...rest } = req.query;

    // Parse limit and page to numbers if they exist, otherwise set defaults
    const parsedLimit = limit ? parseInt(limit as string, 10) : 10;
    const parsedPage = page ? parseInt(page as string, 10) : 1;

    // Construct the filter object from remaining query parameters
    const filter = { ...rest };

    return {
        limit: parsedLimit,
        page: parsedPage,
        search: search as string,
        filter
    };
};


interface QueryOptions {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
    sort?: Record<string, any>;
    searchFields?: string[]; // Array of fields to search
    search?: string
  }
  
  function buildQuery(filter?: Record<string, any>, searchFields?: string[]): any {
    const query: any = {};
  
    // Handle dynamic search across multiple fields
    if (filter?.search && searchFields?.length) {
      const searchRegex = new RegExp(filter.search, 'i');
      query.$or = searchFields.map(field => ({ [field]: searchRegex }));
    }
  
    // Handle dynamic filters
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (key !== 'search') { // Exclude search from normal filter processing
          query[key] = value;
        }
      }
    }
  console.log(query)
    return query;
  }
  
  export async function queryHandler<T = any>(model: Model<T>, options: QueryOptions) {
    const { limit = 10, page = 1, filter, sort, searchFields, search } = options;
    const { limit: parsedLimit, offset } = getPaginationParams(limit, page);
    const query = buildQuery({...filter, search}, searchFields);
    const documents = model
      .find(query)
      .sort(sort)
      .skip(offset)
      .limit(parsedLimit)
  
    return {
      documents,
      limit: parsedLimit,
      offset,
      page: Number(page)
    };
  }

  export function convertSortOrder(obj: Record<string, any>): Record<string, any> {
    const newObj: Record<string, any> = {};
  
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively handle nested objects
        newObj[key] = convertSortOrder(obj[key]);
      } else if (obj[key] === 'asc') {
        newObj[key] = 1;
      } else if (obj[key] === 'desc') {
        newObj[key] = -1;
      } else {
        newObj[key] = obj[key]; // Keep other values unchanged
      }
    }
  
    return newObj;
  }

  export const createSlug = (text: string): string =>{
    return slugify(text)
  }
  
  




