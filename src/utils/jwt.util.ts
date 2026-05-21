import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { IJwtPayload } from '../interfaces/auth.interface';

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return secret;
};

const JWT_EXPIRES_IN: StringValue = (process.env.JWT_EXPIRES_IN ?? '1d') as StringValue;

export const signToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, getSecret(), { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): IJwtPayload => {
  const decoded = jwt.verify(token, getSecret());

  if (typeof decoded === 'string') {
    throw new jwt.JsonWebTokenError('Invalid token payload');
  }

  return decoded as IJwtPayload;
};
