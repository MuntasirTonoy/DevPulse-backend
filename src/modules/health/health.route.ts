import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'DevPulse API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

router.get('/me', authenticate, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Authenticated successfully',
    data: {
      authenticatedAs: req.user,
    },
  });
});

export const HealthRoutes = router;
