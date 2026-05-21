import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validateSignupInput, sanitizeSignupInput } from './auth.validation';
import { signupUser } from './auth.service';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../errors/AppError';
import { IUserPublic } from '../../interfaces/user.interface';

const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validateSignupInput(req.body as Record<string, unknown>);
    if (errors.length > 0) {
      throw new AppError(
        errors.map((e) => e.message).join(', '),
        StatusCodes.BAD_REQUEST,
      );
    }

    const input = sanitizeSignupInput(req.body as Record<string, unknown>);
    const newUser = await signupUser(input);

    sendResponse<IUserPublic>(res, StatusCodes.CREATED, true, 'User registered successfully', newUser);
  } catch (err) {
    next(err);
  }
};

export const AuthController = { signup };
