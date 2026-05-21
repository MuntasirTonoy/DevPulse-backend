import { ICreateUserInput } from '../../interfaces/user.interface';
import { USER_ROLES, UserRole } from '../../constants/user.constants';

interface IValidationError {
  field: string;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignupInput = (body: Record<string, unknown>): IValidationError[] => {
  const errors: IValidationError[] = [];

  if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!body.email || typeof body.email !== 'string' || body.email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!EMAIL_REGEX.test(body.email.trim())) {
    errors.push({ field: 'email', message: 'Email must be a valid email address' });
  }

  if (!body.password || typeof body.password !== 'string' || body.password.trim() === '') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (body.password.trim().length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  if (!body.role || typeof body.role !== 'string' || body.role.trim() === '') {
    errors.push({ field: 'role', message: 'Role is required' });
  } else if (!USER_ROLES.includes(body.role.trim() as UserRole)) {
    errors.push({
      field: 'role',
      message: `Role must be one of: ${USER_ROLES.join(', ')}`,
    });
  }

  return errors;
};

export const sanitizeSignupInput = (body: Record<string, unknown>): ICreateUserInput => ({
  name: (body.name as string).trim(),
  email: (body.email as string).trim().toLowerCase(),
  password: (body.password as string).trim(),
  role: (body.role as string).trim() as UserRole,
});
