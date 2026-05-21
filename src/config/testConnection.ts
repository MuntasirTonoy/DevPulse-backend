import { pool } from './db';

/**
 * Tests the database connection by acquiring a client from the pool
 * and running a simple SELECT 1 health-check query.
 * Exits the process with code 1 on failure.
 */
export const testDatabaseConnection = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    const result = await client.query<{ now: string }>('SELECT NOW() AS now');
    console.log('[DB] Connection successful. Server time:', result.rows[0].now);
  } catch (err) {
    console.error('[DB] Connection test failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  } finally {
    client.release();
  }
};
