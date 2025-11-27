import { Router, Request, Response, NextFunction } from 'express';
import { ClearanceController } from '../controller/clearance.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { roleMiddleware } from '../../../middlewares/role.middleware';
import { Role } from '@prisma/client';

export class ClearanceRoutes {
  private router: Router;
  private controller: ClearanceController;

  constructor() {
    this.router = Router();
    this.controller = new ClearanceController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', authMiddleware, roleMiddleware(Role.ADMIN, Role.HOD, Role.DEAN, Role.STUDENT_AFFAIRS, Role.ACCOUNTS), this.handleAsync(this.controller.getAll.bind(this.controller)));
    this.router.post('/initiate', authMiddleware, roleMiddleware(Role.STUDENT), this.handleAsync(this.controller.initiateClearance.bind(this.controller)));
    this.router.get('/my', authMiddleware, roleMiddleware(Role.STUDENT), this.handleAsync(this.controller.getMyClearance.bind(this.controller)));
    this.router.get('/:id', authMiddleware, this.handleAsync(this.controller.getOne.bind(this.controller)));
    this.router.put('/:id/approve', authMiddleware, roleMiddleware(Role.HOD, Role.DEAN, Role.STUDENT_AFFAIRS, Role.ACCOUNTS), this.handleAsync(this.controller.approveDepartment.bind(this.controller)));
    this.router.put('/:id/reject', authMiddleware, roleMiddleware(Role.HOD, Role.DEAN, Role.STUDENT_AFFAIRS, Role.ACCOUNTS), this.handleAsync(this.controller.rejectDepartment.bind(this.controller)));
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

export default new ClearanceRoutes().getRouter();
