import { UserRole } from '../constants/user.constants';

/** Payload embedded inside the JWT */
export interface IJwtPayload {
  id: number;
  name: string;
  role: UserRole;
}

/** Shape attached to req.user after middleware verification */
export interface IAuthUser {
  id: number;
  name: string;
  role: UserRole;
}

/** Login request body */
export interface ILoginInput {
  email: string;
  password: string;
}

/** Successful login response data */
export interface ILoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}
