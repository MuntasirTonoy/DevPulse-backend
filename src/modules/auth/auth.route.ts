import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

// POST /api/auth/signup
router.post('/signup', AuthController.signup);

// POST /api/auth/login
router.post('/login', AuthController.login);

export const AuthRoutes = router;
