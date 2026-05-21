import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err: Error) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
  process.exit(-1);
});

pool.on('connect', () => {
  console.log('[DB] New client connected to the pool');
});

export { pool };
export type { PoolClient, QueryResult, QueryResultRow };
