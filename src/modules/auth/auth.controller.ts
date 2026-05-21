import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validateSignupInput, sanitizeSignupInput } from './auth.validation';
import { signupUser, loginUser } from './auth.service';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../errors/AppError';
import { IUserPublic } from '../../interfaces/user.interface';
import { ILoginInput, ILoginResponse } from '../../interfaces/auth.interface';

// ── Signup ───────────────────────────────────────────────────
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

// ── Login ────────────────────────────────────────────────────
const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;

    const email = body.email;
    const password = body.password;

    if (!email || typeof email !== 'string' || email.trim() === '') {
      throw new AppError('Email is required', StatusCodes.BAD_REQUEST);
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
      throw new AppError('Password is required', StatusCodes.BAD_REQUEST);
    }

    const input: ILoginInput = {
      email: email.trim().toLowerCase(),
      password: password.trim(),
    };

    const data = await loginUser(input);

    sendResponse<ILoginResponse>(res, StatusCodes.OK, true, 'Login successful', data);
  } catch (err) {
    next(err);
  }
};

export const AuthController = { signup, login };
