import jwt, { SignOptions } from 'jsonwebtoken';
import { IJwtPayload } from '../interfaces/auth.interface';

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return secret;
};

const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN ?? '1d') as SignOptions['expiresIn'];

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
