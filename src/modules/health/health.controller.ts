import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const checkHealth = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'DevPulse API is running smoothly',
    timestamp: new Date().toISOString(),
  });
};

export const HealthController = {
  checkHealth,
};
