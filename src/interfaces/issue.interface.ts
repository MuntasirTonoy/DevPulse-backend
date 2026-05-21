import { IssueType, IssueStatus } from '../constants/issue.constants';

export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateIssueInput {
  title: string;
  description: string;
  type: IssueType;
  reporter_id: number;
}
