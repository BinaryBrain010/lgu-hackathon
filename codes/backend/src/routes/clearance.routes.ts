import { Router } from 'express';
import { ClearanceController } from '../controllers/clearance.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();
const clearanceController = new ClearanceController();

/**
 * @swagger
 * /api/clearance:
 *   get:
 *     summary: Get all clearances
 *     tags: [Clearance]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authMiddleware, roleMiddleware(Role.ADMIN, Role.HOD, Role.DEAN, Role.STUDENT_AFFAIRS, Role.ACCOUNTS), clearanceController.getAll);

/**
 * @swagger
 * /api/clearance/initiate:
 *   post:
 *     summary: Initiate degree clearance
 *     tags: [Clearance]
 *     security:
 *       - bearerAuth: []
 */
router.post('/initiate', authMiddleware, roleMiddleware(Role.STUDENT), clearanceController.initiateClearance);

/**
 * @swagger
 * /api/clearance/my:
 *   get:
 *     summary: Get my clearance
 *     tags: [Clearance]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my', authMiddleware, roleMiddleware(Role.STUDENT), clearanceController.getMyClearance);

/**
 * @swagger
 * /api/clearance/:id:
 *   get:
 *     summary: Get clearance by ID
 *     tags: [Clearance]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authMiddleware, clearanceController.getOne);

/**
 * @swagger
 * /api/clearance/:id/approve:
 *   put:
 *     summary: Approve department clearance
 *     tags: [Clearance]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/approve', authMiddleware, roleMiddleware(Role.HOD, Role.DEAN, Role.STUDENT_AFFAIRS, Role.ACCOUNTS), clearanceController.approveDepartment);

/**
 * @swagger
 * /api/clearance/:id/reject:
 *   put:
 *     summary: Reject department clearance
 *     tags: [Clearance]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/reject', authMiddleware, roleMiddleware(Role.HOD, Role.DEAN, Role.STUDENT_AFFAIRS, Role.ACCOUNTS), clearanceController.rejectDepartment);

export default router;

