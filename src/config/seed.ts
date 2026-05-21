import { pool } from './db';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);

const seedDatabase = async () => {
  try {
    console.log('[SEED] Starting database seeding...');

    // Apply schema
    console.log('[SEED] Applying schema...');
    const schemaSql = fs.readFileSync(path.join(process.cwd(), 'src', 'config', 'schema.sql'), 'utf-8');
    await pool.query(schemaSql);

    // First, clear existing data
    console.log('[SEED] Clearing existing data...');
    await pool.query('DELETE FROM issues');
    await pool.query('DELETE FROM users');

    console.log('[SEED] Inserting users...');
    const maintainerPassword = await bcrypt.hash('maintainer123', BCRYPT_SALT_ROUNDS);
    const contributorPassword = await bcrypt.hash('contributor123', BCRYPT_SALT_ROUNDS);

    const maintainerResult = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Alice Maintainer', 'alice@example.com', maintainerPassword, 'maintainer']
    );
    const maintainerId = maintainerResult.rows[0].id;

    const contributorResult = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Bob Contributor', 'bob@example.com', contributorPassword, 'contributor']
    );
    const contributorId = contributorResult.rows[0].id;

    console.log('[SEED] Inserting issues...');
    await pool.query(
      `INSERT INTO issues (title, description, type, status, reporter_id) VALUES ($1, $2, $3, $4, $5)`,
      [
        'Authentication occasionally fails',
        'Users are reporting that they get randomly logged out after 5 minutes of usage.',
        'bug',
        'open',
        maintainerId
      ]
    );

    await pool.query(
      `INSERT INTO issues (title, description, type, status, reporter_id) VALUES ($1, $2, $3, $4, $5)`,
      [
        'Add dark mode support',
        'The interface is too bright at night. We need a dark mode toggle in the header.',
        'feature_request',
        'in_progress',
        contributorId
      ]
    );

    await pool.query(
      `INSERT INTO issues (title, description, type, status, reporter_id) VALUES ($1, $2, $3, $4, $5)`,
      [
        'Fix layout shift on load',
        'The navigation bar shifts downwards slightly after the font loads completely.',
        'bug',
        'resolved',
        contributorId
      ]
    );

    console.log('[SEED] Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[SEED] Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
