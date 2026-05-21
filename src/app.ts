import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { HealthRoutes } from './modules/health/health.route';
import { StatusCodes } from 'http-status-codes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/health', HealthRoutes);

// Global Error Handler
app.use((err: unknown, req: Request, res: Response, next: express.NextFunction) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal Server Error',
    error: err instanceof Error ? err.message : 'Unknown error'
  });
});

// Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'API route not found',
  });
});

export default app;
