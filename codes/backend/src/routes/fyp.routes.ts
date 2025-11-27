import { Router } from 'express';
import { FYPController } from '../controllers/fyp.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();
const fypController = new FYPController();

/**
 * @swagger
 * /api/fyp:
 *   get:
 *     summary: Get all FYPs
 *     tags: [FYP]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authMiddleware, fypController.getAll);

/**
 * @swagger
 * /api/fyp/my:
 *   get:
 *     summary: Get my FYPs (student or supervisor)
 *     tags: [FYP]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my', authMiddleware, fypController.getMyFYPs);

/**
 * @swagger
 * /api/fyp/idea:
 *   post:
 *     summary: Submit FYP idea
 *     tags: [FYP]
 *     security:
 *       - bearerAuth: []
 */
router.post('/idea', authMiddleware, roleMiddleware(Role.STUDENT), fypController.submitIdea);

/**
 * @swagger
 * /api/fyp/:id:
 *   get:
 *     summary: Get FYP by ID
 *     tags: [FYP]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authMiddleware, fypController.getOne);

/**
 * @swagger
 * /api/fyp/:id/supervisor:
 *   put:
 *     summary: Assign supervisor
 *     tags: [FYP]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/supervisor', authMiddleware, roleMiddleware(Role.STUDENT), fypController.assignSupervisor);

/**
 * @swagger
 * /api/fyp/:id/documents:
 *   post:
 *     summary: Upload FYP document
 *     tags: [FYP]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/documents', authMiddleware, fypController.uploadDocument);

/**
 * @swagger
 * /api/fyp/:id/stage:
 *   put:
 *     summary: Update FYP stage
 *     tags: [FYP]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/stage', authMiddleware, roleMiddleware(Role.SUPERVISOR, Role.ADMIN), fypController.updateStage);

/**
 * @swagger
 * /api/fyp/:id/plagiarism:
 *   post:
 *     summary: Upload plagiarism report
 *     tags: [FYP]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/plagiarism', authMiddleware, fypController.uploadPlagiarismReport);

export default router;

