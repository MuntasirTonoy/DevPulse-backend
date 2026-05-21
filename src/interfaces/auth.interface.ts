import { UserRole } from '../constants/user.constants';

export interface IJwtPayload {
  id: number;
  name: string;
  role: UserRole;
}

export interface IAuthUser {
  id: number;
  name: string;
  role: UserRole;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}
