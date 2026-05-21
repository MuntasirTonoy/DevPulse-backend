import { ICreateIssueInput, IGetIssuesQueryParams, IIssue, IIssueWithReporter, IReporterPublic } from '../../interfaces/issue.interface';
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

export const getAllIssues = async (params: IGetIssuesQueryParams): Promise<IIssueWithReporter[]> => {
  const { sort, type, status } = params;

  const conditions: string[] = [];
  const queryParams: unknown[] = [];
  let paramIdx = 1;

  if (type) {
    conditions.push(`type = $${paramIdx++}`);
    queryParams.push(type);
  }

  if (status) {
    conditions.push(`status = $${paramIdx++}`);
    queryParams.push(status);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderClause = sort === 'oldest' ? 'ORDER BY created_at ASC' : 'ORDER BY created_at DESC';

  const issuesSql = `
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at
    FROM issues
    ${whereClause}
    ${orderClause}
  `;

  const issuesResult = await query<IIssue>(issuesSql, queryParams);
  const issues = issuesResult.rows;

  if (issues.length === 0) return [];

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const reportersResult = await query<IReporterPublic>(ISSUE_QUERIES.GET_REPORTERS_BY_IDS, [
    reporterIds,
  ]);

  const reporterMap = new Map<number, IReporterPublic>();
  reportersResult.rows.forEach((reporter) => {
    reporterMap.set(reporter.id, reporter);
  });

  return issues.map((issue) => ({
    ...issue,
    reporter: reporterMap.get(issue.reporter_id) ?? null,
  }));
};
