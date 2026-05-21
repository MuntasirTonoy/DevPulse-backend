import { IAuthUser } from '../interfaces/auth.interface';

// Safely extends the Express Request type so req.user is fully typed.
// This declaration merges with the existing express namespace.
declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}
