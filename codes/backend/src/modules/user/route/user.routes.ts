import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controller/user.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';

export class UserRoutes {
  private router: Router;
  private controller: UserController;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', authMiddleware, this.handleAsync(this.controller.getAll.bind(this.controller)));
    this.router.get('/:id', authMiddleware, this.handleAsync(this.controller.getOne.bind(this.controller)));
    this.router.post('/', authMiddleware, this.handleAsync(this.controller.create.bind(this.controller)));
    this.router.put('/:id', authMiddleware, this.handleAsync(this.controller.update.bind(this.controller)));
    this.router.delete('/:id', authMiddleware, this.handleAsync(this.controller.delete.bind(this.controller)));
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

export default new UserRoutes().getRouter();
