import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { ICreateUserInput, IUser, IUserPublic } from '../../interfaces/user.interface';
import { ILoginInput, ILoginResponse } from '../../interfaces/auth.interface';
import { query } from '../../config/queryHelper';
import { AppError } from '../../errors/AppError';
import { AUTH_QUERIES } from './auth.queries';
import { signToken } from '../../utils/jwt.util';

const BCRYPT_SALT_ROUNDS = (() => {
  const raw = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
  // Clamp to the allowed range of 8–12
  if (raw < 8 || raw > 12) return 10;
  return raw;
})();

export const signupUser = async (input: ICreateUserInput): Promise<IUserPublic> => {
  const { name, email, password, role } = input;

  // Step 1 — Duplicate email check
  const existing = await query<IUser>(AUTH_QUERIES.FIND_USER_BY_EMAIL, [email]);
  if ((existing.rowCount ?? 0) > 0) {
    throw new AppError('Email is already registered', StatusCodes.CONFLICT);
  }

  // Step 2 — Hash password
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  // Step 3 — Insert and return without password (RETURNING clause excludes it)
  const result = await query<IUserPublic>(AUTH_QUERIES.CREATE_USER, [
    name,
    email,
    hashedPassword,
    role,
  ]);

  return result.rows[0]!;
};

/**
 * Authenticates a user with email + password.
 * 1. Fetches the user by email (separate query — no JOIN)
 * 2. Compares the password with bcrypt
 * 3. Issues a signed JWT and returns token + public user data
 */
export const loginUser = async (input: ILoginInput): Promise<ILoginResponse> => {
  const { email, password } = input;

  // Step 1 — Find user by email
  const result = await query<IUser>(AUTH_QUERIES.FIND_USER_BY_EMAIL, [email]);
  if ((result.rowCount ?? 0) === 0) {
    // Generic message — never reveal whether the email exists
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const user = result.rows[0]!;

  // Step 2 — Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  // Step 3 — Sign JWT with id, name, role in payload
  const token = signToken({ id: user.id, name: user.name, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
