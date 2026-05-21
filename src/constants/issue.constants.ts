export const ISSUE_TYPES = ['bug', 'feature_request'] as const;
export type IssueType = (typeof ISSUE_TYPES)[number];

export const ISSUE_STATUSES = ['open', 'in_progress', 'resolved'] as const;
export type IssueStatus = (typeof ISSUE_STATUSES)[number];
