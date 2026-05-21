import { ICreateIssueInput } from '../../interfaces/issue.interface';
import { ISSUE_TYPES, IssueType } from '../../constants/issue.constants';

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
