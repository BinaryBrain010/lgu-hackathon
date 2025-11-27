import { Router, Request, Response, NextFunction } from 'express';
import { FYPController } from '../controller/fyp.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { roleMiddleware } from '../../../middlewares/role.middleware';
import { Role } from '@prisma/client';

export class FYPRoutes {
  private router: Router;
  private controller: FYPController;

  constructor() {
    this.router = Router();
    this.controller = new FYPController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', authMiddleware, this.handleAsync(this.controller.getAll.bind(this.controller)));
    this.router.get('/my', authMiddleware, this.handleAsync(this.controller.getMyFYPs.bind(this.controller)));
    this.router.post('/idea', authMiddleware, roleMiddleware(Role.STUDENT), this.handleAsync(this.controller.submitIdea.bind(this.controller)));
    this.router.get('/:id', authMiddleware, this.handleAsync(this.controller.getOne.bind(this.controller)));
    this.router.put('/:id/supervisor', authMiddleware, roleMiddleware(Role.STUDENT), this.handleAsync(this.controller.assignSupervisor.bind(this.controller)));
    this.router.post('/:id/documents', authMiddleware, this.handleAsync(this.controller.uploadDocument.bind(this.controller)));
    this.router.put('/:id/stage', authMiddleware, roleMiddleware(Role.SUPERVISOR, Role.ADMIN), this.handleAsync(this.controller.updateStage.bind(this.controller)));
    this.router.post('/:id/plagiarism', authMiddleware, this.handleAsync(this.controller.uploadPlagiarismReport.bind(this.controller)));
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

export default new FYPRoutes().getRouter();
