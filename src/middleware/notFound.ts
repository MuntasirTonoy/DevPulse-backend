import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/AppError';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const err = new AppError(`Route not found: ${req.method} ${req.originalUrl}`, StatusCodes.NOT_FOUND);
  next(err);
};
