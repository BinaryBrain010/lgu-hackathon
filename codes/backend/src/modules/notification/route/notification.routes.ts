import { Router, Request, Response, NextFunction } from 'express';
import { NotificationController } from '../controller/notification.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';

export class NotificationRoutes {
  private router: Router;
  private controller: NotificationController;

  constructor() {
    this.router = Router();
    this.controller = new NotificationController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', authMiddleware, this.handleAsync(this.controller.getMyNotifications.bind(this.controller)));
    this.router.get('/unread-count', authMiddleware, this.handleAsync(this.controller.getUnreadCount.bind(this.controller)));
    this.router.put('/mark-all-read', authMiddleware, this.handleAsync(this.controller.markAllAsRead.bind(this.controller)));
    this.router.get('/:id', authMiddleware, this.handleAsync(this.controller.getOne.bind(this.controller)));
    this.router.put('/:id/read', authMiddleware, this.handleAsync(this.controller.markAsRead.bind(this.controller)));
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

export default new NotificationRoutes().getRouter();
