import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { validateSignupInput, sanitizeSignupInput } from './auth.validation';
import { signupUser, loginUser } from './auth.service';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../errors/AppError';
import { IUserPublic } from '../../interfaces/user.interface';
import { ILoginInput, ILoginResponse } from '../../interfaces/auth.interface';

const signup = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const errors = validateSignupInput(req.body as Record<string, unknown>);
  if (errors.length > 0) {
    throw new AppError('Validation failed', StatusCodes.BAD_REQUEST, errors);
  }

  const input = sanitizeSignupInput(req.body as Record<string, unknown>);
  const user = await signupUser(input);

  sendResponse<IUserPublic>(res, StatusCodes.CREATED, true, 'User registered successfully', user);
});

const login = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const body = req.body as Record<string, unknown>;

  if (!body.email || !body.password) {
    throw new AppError('Email and password are required', StatusCodes.BAD_REQUEST);
  }

  const input: ILoginInput = {
    email: (body.email as string).trim().toLowerCase(),
    password: (body.password as string).trim(),
  };

  const data = await loginUser(input);

  sendResponse<ILoginResponse>(res, StatusCodes.OK, true, 'Login successful', data);
});

export const AuthController = { signup, login };
