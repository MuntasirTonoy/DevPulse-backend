import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { IssueController } from './issue.controller';

const router = Router();

router.get('/', IssueController.getAll);
router.get('/:id', IssueController.getOne);
router.post('/', authenticate, IssueController.create);
router.patch('/:id', authenticate, IssueController.update);

export const IssueRoutes = router;
