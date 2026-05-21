import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/AppError';
import { ERROR_MESSAGES, DB_ERROR_CODES } from '../constants/error.constants';
import jwt from 'jsonwebtoken';

interface IDatabaseError extends Error {
  code?: string;
  detail?: string;
}

export const globalErrorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  let errors: unknown = '';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors ?? '';
  } else if (err instanceof jwt.TokenExpiredError) {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = ERROR_MESSAGES.EXPIRED_TOKEN;
  } else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = ERROR_MESSAGES.INVALID_TOKEN;
  } else if (typeof err === 'object' && err !== null) {
    const dbErr = err as IDatabaseError;
    if (dbErr.code === DB_ERROR_CODES.UNIQUE_VIOLATION) {
      statusCode = StatusCodes.CONFLICT;
      message = 'Duplicate field value entered';
      errors = dbErr.detail ?? '';
    }
  }

  if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    console.error('[Unhandled Error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
