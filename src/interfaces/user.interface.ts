import { UserRole } from '../constants/user.constants';

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

/** Shape of data accepted from the request body */
export interface ICreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/** What is returned to the client — password is intentionally excluded */
export interface IUserPublic {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}
