export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later.',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  NOT_FOUND: 'Resource not found',
  INVALID_TOKEN: 'Invalid token. Access denied.',
  EXPIRED_TOKEN: 'Token has expired. Please log in again.',
} as const;

export const DB_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
} as const;
