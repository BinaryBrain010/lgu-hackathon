import { Router, Request, Response, NextFunction } from 'express';
import { NotificationController } from '../controller/notification.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';

/**
 * @swagger
 * tags:
 *   - name: Notification
 *     description: Notification management endpoints for users
 */

export class NotificationRoutes {
  private router: Router;
  private controller: NotificationController;

  constructor() {
    this.router = Router();
    this.controller = new NotificationController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    /**
     * @swagger
     * /api/v1/notifications:
     *   get:
     *     summary: Get my notifications
     *     description: Retrieve all notifications for the authenticated user. Optionally filter to show only unread notifications.
     *     tags: [Notification]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: unreadOnly
     *         schema:
     *           type: string
     *           enum: [true, false]
     *         description: Filter to show only unread notifications (optional)
     *         example: "true"
     *     responses:
     *       200:
     *         description: Notifications retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Notification'
     *                 message:
     *                   type: string
     *                   example: "Notifications retrieved successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     */
    this.router.get('/', authMiddleware, this.handleAsync(this.controller.getMyNotifications.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/notification/unread-count:
     *   get:
     *     summary: Get unread notification count
     *     description: Get the count of unread notifications for the authenticated user.
     *     tags: [Notification]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Unread count retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *                   properties:
     *                     count:
     *                       type: integer
     *                       example: 5
     *                 message:
     *                   type: string
     *                   example: "Unread count retrieved"
     *       401:
     *         description: Unauthorized - Authentication required
     */
    this.router.get('/unread-count', authMiddleware, this.handleAsync(this.controller.getUnreadCount.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/notification/mark-all-read:
     *   put:
     *     summary: Mark all notifications as read
     *     description: Mark all notifications as read for the authenticated user.
     *     tags: [Notification]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: All notifications marked as read
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *                   properties:
     *                     updated:
     *                       type: integer
     *                       example: 5
     *                 message:
     *                   type: string
     *                   example: "All notifications marked as read"
     *       401:
     *         description: Unauthorized - Authentication required
     */
    this.router.put('/mark-all-read', authMiddleware, this.handleAsync(this.controller.markAllAsRead.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/notification/{id}:
     *   get:
     *     summary: Get notification by ID
     *     description: Retrieve a specific notification by its ID. Must belong to the authenticated user.
     *     tags: [Notification]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Notification ID
     *     responses:
     *       200:
     *         description: Notification retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/Notification'
     *                 message:
     *                   type: string
     *                   example: "Notification retrieved successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Notification not found
     *   put:
     *     summary: Mark notification as read
     *     description: Mark a specific notification as read. Must belong to the authenticated user.
     *     tags: [Notification]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Notification ID
     *     responses:
     *       200:
     *         description: Notification marked as read
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/Notification'
     *                 message:
     *                   type: string
     *                   example: "Notification marked as read"
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Notification not found or unauthorized
     */
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
