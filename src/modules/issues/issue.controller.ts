import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validateCreateIssueInput, sanitizeCreateIssueInput, parseGetIssuesQueryParams } from './issue.validation';
import { createIssue, getAllIssues } from './issue.service';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../errors/AppError';
import { IIssue, IIssueWithReporter } from '../../interfaces/issue.interface';

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validateCreateIssueInput(req.body as Record<string, unknown>);
    if (errors.length > 0) {
      throw new AppError(errors.map((e) => e.message).join(', '), StatusCodes.BAD_REQUEST);
    }

    const reporterId = (req.user as { id: number }).id;
    const input = sanitizeCreateIssueInput(req.body as Record<string, unknown>, reporterId);
    const issue = await createIssue(input);

    sendResponse<IIssue>(res, StatusCodes.CREATED, true, 'Issue created successfully', issue);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = parseGetIssuesQueryParams(req.query as Record<string, unknown>);
    const issues = await getAllIssues(params);

    sendResponse<IIssueWithReporter[]>(res, StatusCodes.OK, true, 'Issues fetched successfully', issues);
  } catch (err) {
    next(err);
  }
};

export const IssueController = { create, getAll };
