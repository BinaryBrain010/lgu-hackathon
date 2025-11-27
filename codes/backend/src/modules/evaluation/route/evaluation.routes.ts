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
    /**
     * @swagger
     * /api/v1/evaluation:
     *   get:
     *     summary: Get all evaluations
     *     description: Retrieve all evaluations with pagination and filtering. Available to all authenticated users.
     *     tags: [Evaluation]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         description: Page number for pagination
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *           default: 10
     *         description: Number of items per page
     *       - in: query
     *         name: fypId
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Filter by FYP ID
     *       - in: query
     *         name: evaluatorId
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Filter by examiner ID
     *       - in: query
     *         name: type
     *         schema:
     *           type: string
     *           enum: [INTERNAL, EXTERNAL]
     *         description: Filter by evaluation type
     *     responses:
     *       200:
     *         description: List of evaluations retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PaginatedEvaluationResponse'
     *             examples:
     *               success:
     *                 summary: Successful response with paginated evaluations
     *                 value:
     *                   success: true
     *                   data:
     *                     data:
     *                       - id: "123e4567-e89b-12d3-a456-426614174000"
     *                         marks: 85.5
     *                         feedback: "Excellent work!"
     *                         type: "INTERNAL"
     *                         fypId: "123e4567-e89b-12d3-a456-426614174001"
     *                         evaluatorId: "123e4567-e89b-12d3-a456-426614174002"
     *                         evaluatedAt: "2024-01-20T14:30:00.000Z"
     *                         createdAt: "2024-01-20T14:30:00.000Z"
     *                         updatedAt: "2024-01-20T14:30:00.000Z"
     *                     pagination:
     *                       page: 1
     *                       limit: 10
     *                       total: 50
     *                       totalPages: 5
     *                   message: "Evaluations retrieved successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             example:
     *               success: false
     *               message: "Unauthorized"
     */
    this.router.get('/', authMiddleware, this.handleAsync(this.controller.getAll.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/evaluation/my:
     *   get:
     *     summary: Get my evaluations
     *     description: Retrieve all evaluations conducted by the authenticated examiner. Only available to EXAMINER role. Returns evaluations with FYP and student details.
     *     tags: [Evaluation]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Examinations retrieved successfully
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
     *                     $ref: '#/components/schemas/EvaluationWithFYP'
     *                 message:
     *                   type: string
     *                   example: "Evaluations retrieved successfully"
     *             examples:
     *               success:
     *                 summary: Examiner's evaluations with FYP details
     *                 value:
     *                   success: true
     *                   data:
     *                     - id: "123e4567-e89b-12d3-a456-426614174000"
     *                       marks: 85.5
     *                       feedback: "Excellent work! Well-structured implementation."
     *                       type: "INTERNAL"
     *                       fypId: "123e4567-e89b-12d3-a456-426614174001"
     *                       evaluatorId: "123e4567-e89b-12d3-a456-426614174002"
     *                       evaluatedAt: "2024-01-20T14:30:00.000Z"
     *                       createdAt: "2024-01-20T14:30:00.000Z"
     *                       updatedAt: "2024-01-20T14:30:00.000Z"
     *                       fyp:
     *                         id: "123e4567-e89b-12d3-a456-426614174001"
     *                         title: "AI-Powered Learning Management System"
     *                         stage: "INTERNAL_DONE"
     *                         student:
     *                           id: "123e4567-e89b-12d3-a456-426614174003"
     *                           email: "student1@acadflow.edu"
     *                           firstName: "John"
     *                           lastName: "Doe"
     *                           role: "STUDENT"
     *                   message: "Evaluations retrieved successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *       403:
     *         description: Forbidden - Only examiners can view their evaluations
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             example:
     *               success: false
     *               message: "Only examiners can submit evaluations"
     */
    this.router.get('/my', authMiddleware, roleMiddleware(Role.EXAMINER), this.handleAsync(this.controller.getMyEvaluations.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/evaluation/fyp/{fypId}:
     *   get:
     *     summary: Get evaluations for a specific FYP
     *     description: Retrieve all evaluations (both internal and external) for a specific FYP. Available to all authenticated users.
     *     tags: [Evaluation]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: fypId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: FYP ID to get evaluations for
     *     responses:
     *       200:
     *         description: Evaluations retrieved successfully
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
     *                     $ref: '#/components/schemas/EvaluationWithDetails'
     *                 message:
     *                   type: string
     *                   example: "Evaluations retrieved successfully"
     *             examples:
     *               success:
     *                 summary: FYP evaluations with examiner details
     *                 value:
     *                   success: true
     *                   data:
     *                     - id: "123e4567-e89b-12d3-a456-426614174000"
     *                       marks: 85.5
     *                       feedback: "Excellent work!"
     *                       type: "INTERNAL"
     *                       fypId: "123e4567-e89b-12d3-a456-426614174001"
     *                       evaluatorId: "123e4567-e89b-12d3-a456-426614174002"
     *                       evaluatedAt: "2024-01-20T14:30:00.000Z"
     *                       createdAt: "2024-01-20T14:30:00.000Z"
     *                       updatedAt: "2024-01-20T14:30:00.000Z"
     *                       evaluator:
     *                         id: "123e4567-e89b-12d3-a456-426614174002"
     *                         email: "examiner1@acadflow.edu"
     *                         firstName: "Dr. Jane"
     *                         lastName: "Smith"
     *                         role: "EXAMINER"
     *                         department: "Computer Science"
     *                     - id: "123e4567-e89b-12d3-a456-426614174004"
     *                       marks: 90.0
     *                       feedback: "Outstanding final submission!"
     *                       type: "EXTERNAL"
     *                       fypId: "123e4567-e89b-12d3-a456-426614174001"
     *                       evaluatorId: "123e4567-e89b-12d3-a456-426614174005"
     *                       evaluatedAt: "2024-01-25T10:15:00.000Z"
     *                       createdAt: "2024-01-25T10:15:00.000Z"
     *                       updatedAt: "2024-01-25T10:15:00.000Z"
     *                       evaluator:
     *                         id: "123e4567-e89b-12d3-a456-426614174005"
     *                         email: "examiner2@acadflow.edu"
     *                         firstName: "Dr. John"
     *                         lastName: "Doe"
     *                         role: "EXAMINER"
     *                         department: "Computer Science"
     *                   message: "Evaluations retrieved successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     */
    this.router.get('/fyp/:fypId', authMiddleware, this.handleAsync(this.controller.getFYPEvaluations.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/evaluation/submit:
     *   post:
     *     summary: Submit evaluation
     *     description: Submit or update an evaluation for an FYP. Only available to EXAMINER role. If an evaluation already exists for the same FYP, examiner, and type, it will be updated. Each examiner can submit one evaluation per type per FYP.
     *     tags: [Evaluation]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SubmitEvaluationRequest'
     *           examples:
     *             internalEvaluation:
     *               summary: Internal evaluation submission
     *               value:
     *                 fypId: "123e4567-e89b-12d3-a456-426614174001"
     *                 type: "INTERNAL"
     *                 marks: 85.5
     *                 feedback: "Excellent work! Well-structured implementation with good documentation. The system architecture is well-designed."
     *             externalEvaluation:
     *               summary: External evaluation submission
     *               value:
     *                 fypId: "123e4567-e89b-12d3-a456-426614174001"
     *                 type: "EXTERNAL"
     *                 marks: 90.0
     *                 feedback: "Outstanding final submission! Comprehensive solution with excellent documentation and implementation quality."
     *             withoutFeedback:
     *               summary: Evaluation without feedback
     *               value:
     *                 fypId: "123e4567-e89b-12d3-a456-426614174001"
     *                 type: "INTERNAL"
     *                 marks: 75.0
     *     responses:
     *       200:
     *         description: Evaluation submitted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/Evaluation'
     *                 message:
     *                   type: string
     *                   example: "Evaluation submitted successfully"
     *             examples:
     *               success:
     *                 summary: Evaluation submitted
     *                 value:
     *                   success: true
     *                   data:
     *                     id: "123e4567-e89b-12d3-a456-426614174000"
     *                     marks: 85.5
     *                     feedback: "Excellent work! Well-structured implementation."
     *                     type: "INTERNAL"
     *                     fypId: "123e4567-e89b-12d3-a456-426614174001"
     *                     evaluatorId: "123e4567-e89b-12d3-a456-426614174002"
     *                     evaluatedAt: "2024-01-20T14:30:00.000Z"
     *                     createdAt: "2024-01-20T14:30:00.000Z"
     *                     updatedAt: "2024-01-20T14:30:00.000Z"
     *                   message: "Evaluation submitted successfully"
     *       400:
     *         description: Bad request - Invalid input (marks out of range, invalid FYP ID, etc.)
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             examples:
     *               invalidMarks:
     *                 summary: Marks out of range
     *                 value:
     *                   success: false
     *                   message: "Number must be less than or equal to 100"
     *               invalidFYPId:
     *                 summary: Invalid FYP ID format
     *                 value:
     *                   success: false
     *                   message: "Invalid FYP ID"
     *       401:
     *         description: Unauthorized - Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *       403:
     *         description: Forbidden - Only examiners can submit evaluations
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             example:
     *               success: false
     *               message: "Only examiners can submit evaluations"
     */
    this.router.post('/submit', authMiddleware, roleMiddleware(Role.EXAMINER), this.handleAsync(this.controller.submitEvaluation.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/evaluation/{id}:
     *   get:
     *     summary: Get evaluation by ID
     *     description: Retrieve a specific evaluation by its ID. Available to all authenticated users.
     *     tags: [Evaluation]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Evaluation ID
     *     responses:
     *       200:
     *         description: Evaluation retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/Evaluation'
     *                 message:
     *                   type: string
     *                   example: "Evaluation retrieved successfully"
     *             examples:
     *               success:
     *                 summary: Single evaluation
     *                 value:
     *                   success: true
     *                   data:
     *                     id: "123e4567-e89b-12d3-a456-426614174000"
     *                     marks: 85.5
     *                     feedback: "Excellent work! Well-structured implementation."
     *                     type: "INTERNAL"
     *                     fypId: "123e4567-e89b-12d3-a456-426614174001"
     *                     evaluatorId: "123e4567-e89b-12d3-a456-426614174002"
     *                     evaluatedAt: "2024-01-20T14:30:00.000Z"
     *                     createdAt: "2024-01-20T14:30:00.000Z"
     *                     updatedAt: "2024-01-20T14:30:00.000Z"
     *                   message: "Evaluation retrieved successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *       404:
     *         description: Evaluation not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             example:
     *               success: false
     *               message: "Evaluation not found"
     */
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
