import { Request } from 'express';

declare global {
  namespace Express {
    // Define User interface directly in the namespace
    interface User {
      _id: string;
      name: string;
      email: string;
      authenticationToken?: string | null;
    }
    
    interface Request {
      user?: User;
      file?: any;
    }
  }
}