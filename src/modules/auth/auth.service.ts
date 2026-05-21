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
  if (raw < 8 || raw > 12) return 10;
  return raw;
})();

export const signupUser = async (input: ICreateUserInput): Promise<IUserPublic> => {
  const { name, email, password, role } = input;

  const existing = await query<IUser>(AUTH_QUERIES.FIND_USER_BY_EMAIL, [email]);
  if ((existing.rowCount ?? 0) > 0) {
    throw new AppError('Email is already registered', StatusCodes.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const result = await query<IUserPublic>(AUTH_QUERIES.CREATE_USER, [
    name,
    email,
    hashedPassword,
    role,
  ]);

  return result.rows[0]!;
};

export const loginUser = async (input: ILoginInput): Promise<ILoginResponse> => {
  const { email, password } = input;

  const result = await query<IUser>(AUTH_QUERIES.FIND_USER_BY_EMAIL, [email]);
  if ((result.rowCount ?? 0) === 0) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const user = result.rows[0]!;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

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
