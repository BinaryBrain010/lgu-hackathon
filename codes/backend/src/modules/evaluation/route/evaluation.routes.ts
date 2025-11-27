import { Router, Request, Response, NextFunction } from 'express';
import { EvaluationController } from '../controller/evaluation.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { roleMiddleware } from '../../../middlewares/role.middleware';
import { Role } from '@prisma/client';

export class EvaluationRoutes {
  private router: Router;
  private controller: EvaluationController;

  constructor() {
    this.router = Router();
    this.controller = new EvaluationController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', authMiddleware, this.handleAsync(this.controller.getAll.bind(this.controller)));
    this.router.get('/my', authMiddleware, roleMiddleware(Role.EXAMINER), this.handleAsync(this.controller.getMyEvaluations.bind(this.controller)));
    this.router.get('/fyp/:fypId', authMiddleware, this.handleAsync(this.controller.getFYPEvaluations.bind(this.controller)));
    this.router.post('/submit', authMiddleware, roleMiddleware(Role.EXAMINER), this.handleAsync(this.controller.submitEvaluation.bind(this.controller)));
    this.router.get('/:id', authMiddleware, this.handleAsync(this.controller.getOne.bind(this.controller)));
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

export default new EvaluationRoutes().getRouter();
