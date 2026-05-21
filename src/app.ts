import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import { AppError } from './errors/AppError';
import { HealthRoutes } from './modules/health/health.route';
import { AuthRoutes } from './modules/auth/auth.route';
import { IssueRoutes } from './modules/issues/issue.route';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/health', HealthRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/issues', IssueRoutes);

app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  console.error('[Unhandled Error]', err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
  });
});

export default app;
