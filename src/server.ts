import app from './app';
import { testDatabaseConnection } from './config/testConnection';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await testDatabaseConnection();

    app.listen(PORT, () => {
      console.log(`[Server] DevPulse API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

startServer();
