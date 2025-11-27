import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();
const adminController = new AdminController();

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Get system analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/analytics', authMiddleware, roleMiddleware(Role.ADMIN), adminController.getAnalytics);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/users', authMiddleware, roleMiddleware(Role.ADMIN), adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.post('/users', authMiddleware, roleMiddleware(Role.ADMIN), adminController.createUser);

export default router;

