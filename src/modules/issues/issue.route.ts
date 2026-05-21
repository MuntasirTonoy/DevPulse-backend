import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { IssueController } from './issue.controller';

const router = Router();

router.post('/', authenticate, IssueController.create);

export const IssueRoutes = router;
