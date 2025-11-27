import { Router } from 'express';
import { authRoutes } from '../modules/auth';
import { fypRoutes } from '../modules/fyp';
import { evaluationRoutes } from '../modules/evaluation';
import { clearanceRoutes } from '../modules/clearance';
import { notificationRoutes } from '../modules/notification';
import { adminRoutes } from '../modules/admin';

export class AppRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.use('/auth', authRoutes);
    this.router.use('/fyp', fypRoutes);
    this.router.use('/evaluations', evaluationRoutes);
    this.router.use('/clearance', clearanceRoutes);
    this.router.use('/notifications', notificationRoutes);
    this.router.use('/admin', adminRoutes);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new AppRoutes().getRouter();
