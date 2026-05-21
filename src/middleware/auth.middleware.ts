import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/jwt.util';
import { AppError } from '../errors/AppError';
import { ERROR_MESSAGES } from '../constants/error.constants';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.headers['authorization'];

  if (!token || typeof token !== 'string' || token.trim() === '') {
    return next(new AppError(ERROR_MESSAGES.UNAUTHORIZED, StatusCodes.UNAUTHORIZED));
  }

  try {
    const decoded = verifyToken(token.trim());
    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };
    next();
  } catch (err) {
    next(err);
  }
};
