import { Router, Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';

export abstract class BaseRouter {
  protected router: Router;
  protected abstract controller: BaseController<any, any, any, any>;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  protected abstract setupRoutes(): void;

  protected bindRoute(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    path: string,
    handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
    middlewares: Array<(req: Request, res: Response, next: NextFunction) => void | Promise<void>> = []
  ): void {
    this.router[method](path, ...middlewares, this.handleAsync(handler));
  }

  protected handleAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  public getRouter(): Router {
    return this.router;
  }
}

