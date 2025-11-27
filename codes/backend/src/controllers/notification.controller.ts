import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { BaseController } from '../base/BaseController';
import { ApiResponseHandler } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

export class NotificationController extends BaseController<any, any, any, any> {
  modelName = 'Notification';
  private notificationService: NotificationService;

  constructor() {
    super(new NotificationService());
    this.notificationService = new NotificationService();
  }

  getMyNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const unreadOnly = req.query.unreadOnly === 'true';
      const notifications = await this.notificationService.findByUserId(
        req.user.userId,
        unreadOnly
      );

      ApiResponseHandler.success(res, notifications, 'Notifications retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const notification = await this.notificationService.markAsRead(id, req.user.userId);
      ApiResponseHandler.success(res, notification, 'Notification marked as read');
    } catch (error: any) {
      if (error.message?.includes('not found') || error.message?.includes('unauthorized')) {
        ApiResponseHandler.notFound(res, error.message);
        return;
      }
      next(error);
    }
  };

  markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const result = await this.notificationService.markAllAsRead(req.user.userId);
      ApiResponseHandler.success(res, result, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const count = await this.notificationService.getUnreadCount(req.user.userId);
      ApiResponseHandler.success(res, { count }, 'Unread count retrieved');
    } catch (error) {
      next(error);
    }
  };
}

