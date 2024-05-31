// import { Language, User } from "../custom";

// to make the file a module and avoid the TypeScript error
export { }

declare global {
  namespace Express {
    interface User {
      _id: string,
      name: string,
      email: string,
      authenticationToken?: string | null
    }
    export interface Request {
      user?: User;
      file?: any
    }
  }
}