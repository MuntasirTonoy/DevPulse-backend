import express, { Application } from 'express';
import cors from 'cors';
import { HealthRoutes } from './modules/health/health.route';
import { AuthRoutes } from './modules/auth/auth.route';
import { IssueRoutes } from './modules/issues/issue.route';
import { notFoundHandler } from './middleware/notFound';
import { globalErrorHandler } from './middleware/globalErrorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/health', HealthRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/issues', IssueRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
