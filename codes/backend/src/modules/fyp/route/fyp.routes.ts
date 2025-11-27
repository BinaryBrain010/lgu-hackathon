import { Router, Request, Response, NextFunction } from 'express';
import { FYPController } from '../controller/fyp.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { roleMiddleware } from '../../../middlewares/role.middleware';
import { Role } from '@prisma/client';

/**
 * @swagger
 * tags:
 *   - name: FYP
 *     description: Final Year Project (FYP) management endpoints
 */

export class FYPRoutes {
  private router: Router;
  private controller: FYPController;

  constructor() {
    this.router = Router();
    this.controller = new FYPController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    /**
     * @swagger
     * /api/v1/fyp:
     *   get:
     *     summary: Get all FYPs
     *     description: Retrieve all FYPs with pagination and filtering. Available to all authenticated users.
     *     tags: [FYP]
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
     *         name: studentId
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Filter by student ID
     *       - in: query
     *         name: supervisorId
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Filter by supervisor ID
     *       - in: query
     *         name: stage
     *         schema:
     *           type: string
     *           enum: [IDEA_PENDING, IDEA_APPROVED, IDEA_REJECTED, SUPERVISOR_PENDING, SUPERVISOR_ASSIGNED, PROPOSAL_PENDING, PROPOSAL_APPROVED, PROPOSAL_REJECTED, SRS_PENDING, SRS_APPROVED, SRS_REJECTED, INTERNAL_PENDING, INTERNAL_DONE, EXTERNAL_PENDING, EXTERNAL_DONE, COMPLETED]
     *         description: Filter by FYP stage
     *     responses:
     *       200:
     *         description: List of FYPs retrieved successfully
     *       401:
     *         description: Unauthorized - Authentication required
     */
    this.router.get('/', authMiddleware, this.handleAsync(this.controller.getAll.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/fyp/my:
     *   get:
     *     summary: Get my FYPs
     *     description: Retrieve FYPs for the authenticated user. Returns student's FYPs if role is STUDENT, or supervised FYPs if role is SUPERVISOR.
     *     tags: [FYP]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: FYPs retrieved successfully
     *       401:
     *         description: Unauthorized - Authentication required
     *       403:
     *         description: Forbidden - Only students and supervisors can view their FYPs
     */
    this.router.get('/my', authMiddleware, this.handleAsync(this.controller.getMyFYPs.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/fyp/idea:
     *   post:
     *     summary: Submit FYP idea
     *     description: Submit a new FYP idea. Only available to STUDENT role. The FYP will be created with IDEA_PENDING stage.
     *     tags: [FYP]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *             properties:
     *               title:
     *                 type: string
     *                 minLength: 3
     *                 description: FYP title (must be unique)
     *                 example: "AI-Powered Learning Management System"
     *               description:
     *                 type: string
     *                 description: Optional FYP description
     *                 example: "An intelligent LMS that adapts to student learning patterns"
     *     responses:
     *       201:
     *         description: FYP idea submitted successfully
     *       400:
     *         description: Bad request - Invalid input
     *       401:
     *         description: Unauthorized - Authentication required
     *       403:
     *         description: Forbidden - Only students can submit FYP ideas
     *       409:
     *         description: Conflict - FYP title already exists
     */
    this.router.post('/idea', authMiddleware, roleMiddleware(Role.STUDENT), this.handleAsync(this.controller.submitIdea.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/fyp/{id}:
     *   get:
     *     summary: Get FYP by ID
     *     description: Retrieve a specific FYP by its ID. Available to all authenticated users.
     *     tags: [FYP]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: FYP ID
     *     responses:
     *       200:
     *         description: FYP retrieved successfully
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: FYP not found
     */
    this.router.get('/:id', authMiddleware, this.handleAsync(this.controller.getOne.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/fyp/{id}/supervisor:
     *   put:
     *     summary: Assign supervisor to FYP
     *     description: Assign a supervisor to an FYP. Only available to STUDENT role. FYP must be in SUPERVISOR_PENDING stage and must belong to the student.
     *     tags: [FYP]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: FYP ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - supervisorId
     *             properties:
     *               supervisorId:
     *                 type: string
     *                 format: uuid
     *                 description: ID of the supervisor to assign
     *                 example: "123e4567-e89b-12d3-a456-426614174003"
     *     responses:
     *       200:
     *         description: Supervisor assigned successfully
     *       400:
     *         description: Bad request - Invalid stage or input
     *       401:
     *         description: Unauthorized - Authentication required
     *       403:
     *         description: Forbidden - Only students can assign supervisors to their own FYPs
     *       404:
     *         description: FYP not found
     */
    this.router.put('/:id/supervisor', authMiddleware, roleMiddleware(Role.STUDENT), this.handleAsync(this.controller.assignSupervisor.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/fyp/{id}/documents:
     *   post:
     *     summary: Upload FYP document
     *     description: Upload a document (PROPOSAL, SRS, or FINAL) for an FYP. Available to student and supervisor of the FYP. Automatically advances stage when appropriate.
     *     tags: [FYP]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: FYP ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - type
     *               - fileUrl
     *             properties:
     *               type:
     *                 type: string
     *                 enum: [PROPOSAL, SRS, FINAL]
     *                 description: Document type
     *                 example: "PROPOSAL"
     *               fileUrl:
     *                 type: string
     *                 format: uri
     *                 description: URL of the uploaded document
     *                 example: "https://storage.acadflow.edu/documents/proposal-v1.pdf"
     *               version:
     *                 type: integer
     *                 minimum: 1
     *                 description: Document version (auto-incremented if not provided)
     *                 example: 1
     *     responses:
     *       201:
     *         description: Document uploaded successfully
     *       400:
     *         description: Bad request - Invalid input
     *       401:
     *         description: Unauthorized - Authentication required
     *       403:
     *         description: Forbidden - Unauthorized to upload documents for this FYP
     *       404:
     *         description: FYP not found
     */
    this.router.post('/:id/documents', authMiddleware, this.handleAsync(this.controller.uploadDocument.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/fyp/{id}/stage:
     *   put:
     *     summary: Update FYP stage
     *     description: Update the stage of an FYP. Only available to SUPERVISOR or ADMIN role. Validates stage transitions according to workflow rules.
     *     tags: [FYP]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: FYP ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - stage
     *             properties:
     *               stage:
     *                 type: string
     *                 enum: [IDEA_PENDING, IDEA_APPROVED, IDEA_REJECTED, SUPERVISOR_PENDING, SUPERVISOR_ASSIGNED, PROPOSAL_PENDING, PROPOSAL_APPROVED, PROPOSAL_REJECTED, SRS_PENDING, SRS_APPROVED, SRS_REJECTED, INTERNAL_PENDING, INTERNAL_DONE, EXTERNAL_PENDING, EXTERNAL_DONE, COMPLETED]
     *                 description: Target FYP stage
     *                 example: "PROPOSAL_APPROVED"
     *     responses:
     *       200:
     *         description: FYP stage updated successfully
     *       400:
     *         description: Bad request - Invalid stage transition
     *       401:
     *         description: Unauthorized - Authentication required
     *       403:
     *         description: Forbidden - Only supervisors and admins can update FYP stage
     *       404:
     *         description: FYP not found
     */
    this.router.put('/:id/stage', authMiddleware, roleMiddleware(Role.SUPERVISOR, Role.ADMIN), this.handleAsync(this.controller.updateStage.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/fyp/{id}/plagiarism:
     *   post:
     *     summary: Upload plagiarism report
     *     description: Upload a plagiarism report for an FYP. Available to authorized users. Similarity percentage must be below threshold (20%).
     *     tags: [FYP]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: FYP ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - similarity
     *               - reportUrl
     *             properties:
     *               similarity:
     *                 type: number
     *                 format: float
     *                 minimum: 0
     *                 maximum: 100
     *                 description: Plagiarism similarity percentage (must be ≤ 20%)
     *                 example: 5.5
     *               reportUrl:
     *                 type: string
     *                 format: uri
     *                 description: URL of the plagiarism report
     *                 example: "https://storage.acadflow.edu/plagiarism/report.pdf"
     *     responses:
     *       201:
     *         description: Plagiarism report uploaded successfully
     *       400:
     *         description: Bad request - Invalid input or similarity exceeds threshold
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: FYP not found
     */
    this.router.post('/:id/plagiarism', authMiddleware, this.handleAsync(this.controller.uploadPlagiarismReport.bind(this.controller)));
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

export default new FYPRoutes().getRouter();
