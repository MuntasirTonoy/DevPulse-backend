import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

// POST /api/auth/signup
router.post('/signup', AuthController.signup);

export const AuthRoutes = router;
