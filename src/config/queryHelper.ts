import { QueryResult, QueryResultRow } from 'pg';
import { pool } from './db';

/**
 * Execute a single parameterized SQL query using the shared pool.
 *
 * @param text   - The SQL query string with $1, $2 ... placeholders.
 * @param params - Optional array of values to bind to the placeholders.
 * @returns      - The full pg QueryResult object.
 */
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

/**
 * Acquire a dedicated client from the pool.
 * Use this for transactions where you need to run multiple queries
 * atomically with BEGIN / COMMIT / ROLLBACK.
 *
 * Always call client.release() in a finally block.
 *
 * @example
 * const client = await getClient();
 * try {
 *   await client.query('BEGIN');
 *   await client.query(...);
 *   await client.query('COMMIT');
 * } catch (err) {
 *   await client.query('ROLLBACK');
 *   throw err;
 * } finally {
 *   client.release();
 * }
 */
export const getClient = async () => {
  return pool.connect();
};
