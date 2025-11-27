import { Router, Request, Response, NextFunction } from 'express';
import { AdminController } from '../controller/admin.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { roleMiddleware } from '../../../middlewares/role.middleware';
import { Role } from '@prisma/client';

export class AdminRoutes {
  private router: Router;
  private controller: AdminController;

  constructor() {
    this.router = Router();
    this.controller = new AdminController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/analytics', authMiddleware, roleMiddleware(Role.ADMIN), this.handleAsync(this.controller.getAnalytics.bind(this.controller)));
    this.router.get('/users', authMiddleware, roleMiddleware(Role.ADMIN), this.handleAsync(this.controller.getAllUsers.bind(this.controller)));
    this.router.post('/users', authMiddleware, roleMiddleware(Role.ADMIN), this.handleAsync(this.controller.createUser.bind(this.controller)));
  }

  private handleAsync(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new AdminRoutes().getRouter();
