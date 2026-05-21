import { ICreateIssueInput } from '../../interfaces/issue.interface';
import { ISSUE_TYPES, IssueType, ISSUE_STATUSES, IssueStatus } from '../../constants/issue.constants';
import { IGetIssuesQueryParams } from '../../interfaces/issue.interface';

interface IValidationError {
  field: string;
  message: string;
}

export const validateCreateIssueInput = (body: Record<string, unknown>): IValidationError[] => {
  const errors: IValidationError[] = [];

  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (body.title.trim().length > 150) {
    errors.push({ field: 'title', message: 'Title must not exceed 150 characters' });
  }

  if (!body.description || typeof body.description !== 'string' || body.description.trim() === '') {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (body.description.trim().length < 20) {
    errors.push({ field: 'description', message: 'Description must be at least 20 characters' });
  }

  if (!body.type || typeof body.type !== 'string' || body.type.trim() === '') {
    errors.push({ field: 'type', message: 'Type is required' });
  } else if (!ISSUE_TYPES.includes(body.type.trim() as IssueType)) {
    errors.push({ field: 'type', message: `Type must be one of: ${ISSUE_TYPES.join(', ')}` });
  }

  return errors;
};

export const sanitizeCreateIssueInput = (
  body: Record<string, unknown>,
  reporterId: number,
): ICreateIssueInput => ({
  title: (body.title as string).trim(),
  description: (body.description as string).trim(),
  type: (body.type as string).trim() as IssueType,
  reporter_id: reporterId,
});

export const parseGetIssuesQueryParams = (rawQuery: Record<string, unknown>): IGetIssuesQueryParams => {
  const params: IGetIssuesQueryParams = {};

  const sort = rawQuery.sort;
  if (sort === 'oldest' || sort === 'newest') {
    params.sort = sort;
  }

  const type = rawQuery.type;
  if (typeof type === 'string' && ISSUE_TYPES.includes(type.trim() as IssueType)) {
    params.type = type.trim() as IssueType;
  }

  const status = rawQuery.status;
  if (typeof status === 'string' && ISSUE_STATUSES.includes(status.trim() as IssueStatus)) {
    params.status = status.trim() as IssueStatus;
  }

  return params;
};

/**
 * Parses a raw route param string into a positive integer.
 * Returns null if the value is not a valid positive integer.
 */
export const parseNumericId = (raw: string): number | null => {
  const trimmed = raw.trim();
  const parsed = parseInt(trimmed, 10);
  if (isNaN(parsed) || parsed <= 0 || String(parsed) !== trimmed) return null;
  return parsed;
};
