import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/jwt.util';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization'];

  if (!token || typeof token !== 'string' || token.trim() === '') {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
    return;
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
    if (err instanceof jwt.TokenExpiredError) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Token has expired. Please log in again.',
      });
      return;
    }

    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid token. Access denied.',
    });
  }
};
