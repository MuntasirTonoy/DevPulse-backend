import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import {
  validateCreateIssueInput,
  sanitizeCreateIssueInput,
  parseGetIssuesQueryParams,
  parseNumericId,
  validateUpdateIssueInput,
  sanitizeUpdateIssueInput,
} from './issue.validation';
import { createIssue, getAllIssues, getIssueById, updateIssue, deleteIssue } from './issue.service';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../errors/AppError';
import { IIssue, IIssueWithReporter } from '../../interfaces/issue.interface';
import { IAuthUser } from '../../interfaces/auth.interface';

const create = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const errors = validateCreateIssueInput(req.body as Record<string, unknown>);
  if (errors.length > 0) {
    throw new AppError('Validation failed', StatusCodes.BAD_REQUEST, errors);
  }

  const reporterId = (req.user as IAuthUser).id;
  const input = sanitizeCreateIssueInput(req.body as Record<string, unknown>, reporterId);
  const issue = await createIssue(input);

  sendResponse<IIssue>(res, StatusCodes.CREATED, true, 'Issue created successfully', issue);
});

const getAll = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const params = parseGetIssuesQueryParams(req.query as Record<string, unknown>);
  const issues = await getAllIssues(params);

  sendResponse<IIssueWithReporter[]>(res, StatusCodes.OK, true, 'Issues fetched successfully', issues);
});

const getOne = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseNumericId(rawId ?? '');
  if (id === null) {
    throw new AppError('Issue ID must be a positive integer', StatusCodes.BAD_REQUEST);
  }

  const issue = await getIssueById(id);

  sendResponse<IIssueWithReporter>(res, StatusCodes.OK, true, 'Issue fetched successfully', issue);
});

const update = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseNumericId(rawId ?? '');
  if (id === null) {
    throw new AppError('Issue ID must be a positive integer', StatusCodes.BAD_REQUEST);
  }

  const errors = validateUpdateIssueInput(req.body as Record<string, unknown>);
  if (errors.length > 0) {
    throw new AppError('Validation failed', StatusCodes.BAD_REQUEST, errors);
  }

  const requestingUser = req.user as IAuthUser;
  const input = sanitizeUpdateIssueInput(req.body as Record<string, unknown>);
  const updatedIssue = await updateIssue(id, input, requestingUser);

  sendResponse<IIssueWithReporter>(res, StatusCodes.OK, true, 'Issue updated successfully', updatedIssue);
});

const deleteOne = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseNumericId(rawId ?? '');
  if (id === null) {
    throw new AppError('Issue ID must be a positive integer', StatusCodes.BAD_REQUEST);
  }

  const requestingUser = req.user as IAuthUser;
  await deleteIssue(id, requestingUser);

  sendResponse<null>(res, StatusCodes.OK, true, 'Issue deleted successfully');
});

export const IssueController = { create, getAll, getOne, update, deleteOne };
