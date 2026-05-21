import { ICreateIssueInput, IIssue } from '../../interfaces/issue.interface';
import { query } from '../../config/queryHelper';
import { ISSUE_QUERIES } from './issue.queries';

export const createIssue = async (input: ICreateIssueInput): Promise<IIssue> => {
  const { title, description, type, reporter_id } = input;

  const result = await query<IIssue>(ISSUE_QUERIES.CREATE_ISSUE, [
    title,
    description,
    type,
    reporter_id,
  ]);

  return result.rows[0];
};
