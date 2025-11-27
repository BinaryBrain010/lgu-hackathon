import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const notificationController = new NotificationController();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get my notifications
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authMiddleware, notificationController.getMyNotifications);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 */
router.get('/unread-count', authMiddleware, notificationController.getUnreadCount);

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 */
router.put('/mark-all-read', authMiddleware, notificationController.markAllAsRead);

/**
 * @swagger
 * /api/notifications/:id:
 *   get:
 *     summary: Get notification by ID
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authMiddleware, notificationController.getOne);

/**
 * @swagger
 * /api/notifications/:id/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/read', authMiddleware, notificationController.markAsRead);

export default router;

