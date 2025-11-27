import { Router, Request, Response, NextFunction } from 'express';
import { EvaluationController } from '../controller/evaluation.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { roleMiddleware } from '../../../middlewares/role.middleware';
import { Role } from '@prisma/client';

/**
 * @swagger
 * tags:
 *   - name: Evaluation
 *     description: FYP evaluation management endpoints for internal and external examiners
 * components:
 *   schemas:
 *     Evaluation:
 *       type: object
 *       required:
 *         - id
 *         - marks
 *         - type
 *         - fypId
 *         - evaluatorId
 *         - evaluatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the evaluation
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         marks:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           description: Marks awarded by the examiner (0-100)
 *           example: 85.5
 *         feedback:
 *           type: string
 *           nullable: true
 *           description: Feedback/comments from the examiner
 *           example: "Excellent work! Well-structured implementation with good documentation."
 *         type:
 *           type: string
 *           enum: [INTERNAL, EXTERNAL]
 *           description: Type of evaluation - INTERNAL (conducted by internal examiner) or EXTERNAL (conducted by external examiner)
 *           example: INTERNAL
 *         fypId:
 *           type: string
 *           format: uuid
 *           description: ID of the FYP being evaluated
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *         evaluatorId:
 *           type: string
 *           format: uuid
 *           description: ID of the examiner conducting the evaluation
 *           example: "123e4567-e89b-12d3-a456-426614174002"
 *         evaluatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when evaluation was conducted
 *           example: "2024-01-20T14:30:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Record creation timestamp
 *           example: "2024-01-20T14:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Record last update timestamp
 *           example: "2024-01-20T15:45:00.000Z"
 *     EvaluationWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Evaluation'
 *         - type: object
 *           properties:
 *             evaluator:
 *               $ref: '#/components/schemas/User'
 *               description: Examiner information
 *     EvaluationWithFYP:
 *       allOf:
 *         - $ref: '#/components/schemas/Evaluation'
 *         - type: object
 *           properties:
 *             evaluator:
 *               $ref: '#/components/schemas/User'
 *             fyp:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 title:
 *                   type: string
 *                 stage:
 *                   type: string
 *                 student:
 *                   $ref: '#/components/schemas/User'
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *         email:
 *           type: string
 *           format: email
 *           example: "examiner1@acadflow.edu"
 *         firstName:
 *           type: string
 *           example: "Dr. Jane"
 *         lastName:
 *           type: string
 *           example: "Smith"
 *         role:
 *           type: string
 *           enum: [STUDENT, SUPERVISOR, EXAMINER, HOD, DEAN, STUDENT_AFFAIRS, ACCOUNTS, ADMIN]
 *           example: "EXAMINER"
 *         department:
 *           type: string
 *           nullable: true
 *           example: "Computer Science"
 *     PaginatedEvaluationResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evaluation'
 *             pagination:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *         message:
 *           type: string
 *           example: "Evaluations retrieved successfully"
 *     SubmitEvaluationRequest:
 *       type: object
 *       required:
 *         - fypId
 *         - type
 *         - marks
 *       properties:
 *         fypId:
 *           type: string
 *           format: uuid
 *           description: ID of the FYP to evaluate
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *         type:
 *           type: string
 *           enum: [INTERNAL, EXTERNAL]
 *           description: Type of evaluation
 *           example: INTERNAL
 *         marks:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           description: Marks to award (0-100)
 *           example: 85.5
 *         feedback:
 *           type: string
 *           description: Optional feedback/comments
 *           example: "Excellent work! Well-structured implementation with good documentation."
 *     ApiError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error message description"
 */

export class EvaluationRoutes {
  private router: Router;
  private controller: EvaluationController;

  constructor() {
    this.router = Router();
    this.controller = new EvaluationController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', authMiddleware, this.handleAsync(this.controller.getAll.bind(this.controller)));
    this.router.get('/my', authMiddleware, roleMiddleware(Role.EXAMINER), this.handleAsync(this.controller.getMyEvaluations.bind(this.controller)));
    this.router.get('/fyp/:fypId', authMiddleware, this.handleAsync(this.controller.getFYPEvaluations.bind(this.controller)));
    this.router.post('/submit', authMiddleware, roleMiddleware(Role.EXAMINER), this.handleAsync(this.controller.submitEvaluation.bind(this.controller)));
    this.router.get('/:id', authMiddleware, this.handleAsync(this.controller.getOne.bind(this.controller)));
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

export default new EvaluationRoutes().getRouter();
