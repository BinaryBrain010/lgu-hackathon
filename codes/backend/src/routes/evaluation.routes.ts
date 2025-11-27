import { Router } from 'express';
import { EvaluationController } from '../controllers/evaluation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();
const evaluationController = new EvaluationController();

/**
 * @swagger
 * /api/evaluations:
 *   get:
 *     summary: Get all evaluations
 *     tags: [Evaluation]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authMiddleware, evaluationController.getAll);

/**
 * @swagger
 * /api/evaluations/my:
 *   get:
 *     summary: Get my evaluations
 *     tags: [Evaluation]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my', authMiddleware, roleMiddleware(Role.EXAMINER), evaluationController.getMyEvaluations);

/**
 * @swagger
 * /api/evaluations/fyp/:fypId:
 *   get:
 *     summary: Get evaluations for an FYP
 *     tags: [Evaluation]
 *     security:
 *       - bearerAuth: []
 */
router.get('/fyp/:fypId', authMiddleware, evaluationController.getFYPEvaluations);

/**
 * @swagger
 * /api/evaluations/submit:
 *   post:
 *     summary: Submit evaluation
 *     tags: [Evaluation]
 *     security:
 *       - bearerAuth: []
 */
router.post('/submit', authMiddleware, roleMiddleware(Role.EXAMINER), evaluationController.submitEvaluation);

/**
 * @swagger
 * /api/evaluations/:id:
 *   get:
 *     summary: Get evaluation by ID
 *     tags: [Evaluation]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authMiddleware, evaluationController.getOne);

export default router;

