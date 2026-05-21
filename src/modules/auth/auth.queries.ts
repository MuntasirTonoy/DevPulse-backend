export const AUTH_QUERIES = {
  FIND_USER_BY_EMAIL: `
    SELECT id, name, email, password, role, created_at, updated_at
    FROM users
    WHERE email = $1
    LIMIT 1
  `,

  CREATE_USER: `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
  `,
} as const;
