export const ISSUE_QUERIES = {
  CREATE_ISSUE: `
    INSERT INTO issues (title, description, type, status, reporter_id)
    VALUES ($1, $2, $3, 'open', $4)
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `,

  GET_ISSUE_BY_ID: `
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at
    FROM issues
    WHERE id = $1
    LIMIT 1
  `,

  GET_REPORTER_BY_ID: `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    LIMIT 1
  `,

  GET_REPORTERS_BY_IDS: `
    SELECT id, name, role
    FROM users
    WHERE id = ANY($1)
  `,
} as const;
