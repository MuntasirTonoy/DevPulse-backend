import { QueryResult, QueryResultRow } from 'pg';
import { pool } from './db';

export const query = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> => {
  const start = Date.now();
  const result = await pool.query<T>(text, params);
  const duration = Date.now() - start;

  console.log('[DB] Executed query', {
    text,
    duration: `${duration}ms`,
    rows: result.rowCount,
  });

  return result;
};

export const getClient = async () => {
  return pool.connect();
};
