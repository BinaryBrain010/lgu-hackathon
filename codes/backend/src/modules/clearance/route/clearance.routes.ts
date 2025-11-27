import { Router, Request, Response, NextFunction } from 'express';
import { ClearanceController } from '../controller/clearance.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { roleMiddleware } from '../../../middlewares/role.middleware';
import { Role } from '@prisma/client';

/**
 * @swagger
 * tags:
 *   - name: Clearance
 *     description: Degree clearance management endpoints for multi-department approval workflow
 * components:
 *   schemas:
 *     DegreeClearance:
 *       type: object
 *       required:
 *         - id
 *         - studentId
 *         - status
 *         - departmentStatus
 *         - academicStatus
 *         - affairsStatus
 *         - accountsStatus
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the clearance
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         studentId:
 *           type: string
 *           format: uuid
 *           description: ID of the student requesting clearance
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *         status:
 *           type: string
 *           enum: [PENDING, IN_REVIEW, APPROVED, REJECTED]
 *           description: Overall clearance status
 *           example: IN_REVIEW
 *         departmentStatus:
 *           type: string
 *           enum: [PENDING, IN_REVIEW, APPROVED, REJECTED]
 *           description: Department clearance status (HOD approval)
 *           example: APPROVED
 *         academicStatus:
 *           type: string
 *           enum: [PENDING, IN_REVIEW, APPROVED, REJECTED]
 *           description: Academic office clearance status (Dean approval)
 *           example: PENDING
 *         affairsStatus:
 *           type: string
 *           enum: [PENDING, IN_REVIEW, APPROVED, REJECTED]
 *           description: Student Affairs clearance status (hostel/library/lab)
 *           example: PENDING
 *         accountsStatus:
 *           type: string
 *           enum: [PENDING, IN_REVIEW, APPROVED, REJECTED]
 *           description: Accounts office clearance status (financial clearance)
 *           example: PENDING
 *         initiatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when clearance was initiated
 *           example: "2024-01-15T10:30:00.000Z"
 *         completedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Timestamp when clearance was completed (null if not completed)
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Record creation timestamp
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Record last update timestamp
 *           example: "2024-01-16T14:20:00.000Z"
 *     DegreeClearanceWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/DegreeClearance'
 *         - type: object
 *           properties:
 *             student:
 *               $ref: '#/components/schemas/User'
 *               description: Student information
 *             remarks:
 *               type: array
 *               description: List of clearance remarks/notes from officers
 *               items:
 *                 $ref: '#/components/schemas/ClearanceRemark'
 *     ClearanceRemark:
 *       type: object
 *       required:
 *         - id
 *         - department
 *         - message
 *         - clearanceId
 *         - officerId
 *         - createdAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the remark
 *           example: "123e4567-e89b-12d3-a456-426614174002"
 *         department:
 *           type: string
 *           enum: [DEPARTMENT, ACADEMIC, STUDENT_AFFAIRS, ACCOUNTS]
 *           description: Department that made the remark
 *           example: DEPARTMENT
 *         message:
 *           type: string
 *           description: Remark message from the officer
 *           example: "All department requirements have been met and verified."
 *         clearanceId:
 *           type: string
 *           format: uuid
 *           description: ID of the associated clearance
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         officerId:
 *           type: string
 *           format: uuid
 *           description: ID of the officer who made the remark
 *           example: "123e4567-e89b-12d3-a456-426614174003"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when remark was created
 *           example: "2024-01-16T09:15:00.000Z"
 *         officer:
 *           $ref: '#/components/schemas/User'
 *           description: Officer information
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
 *           example: "student1@acadflow.edu"
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         role:
 *           type: string
 *           enum: [STUDENT, SUPERVISOR, EXAMINER, HOD, DEAN, STUDENT_AFFAIRS, ACCOUNTS, ADMIN]
 *           example: "STUDENT"
 *         studentId:
 *           type: string
 *           nullable: true
 *           example: "STU0001"
 *         department:
 *           type: string
 *           nullable: true
 *           example: "Computer Science"
 *     PaginatedClearanceResponse:
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
 *                 $ref: '#/components/schemas/DegreeClearance'
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
 *                   example: 25
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *         message:
 *           type: string
 *           example: "Clearances retrieved successfully"
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

export class ClearanceRoutes {
  private router: Router;
  private controller: ClearanceController;

  constructor() {
    this.router = Router();
    this.controller = new ClearanceController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    /**
     * @swagger
     * /api/v1/clearance:
     *   get:
     *     summary: Get all degree clearances
     *     description: Retrieve all degree clearances with pagination and filtering. Available to ADMIN, HOD, DEAN, STUDENT_AFFAIRS, and ACCOUNTS roles.
     *     tags: [Clearance]
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
     *         name: status
     *         schema:
     *           type: string
     *           enum: [PENDING, IN_REVIEW, APPROVED, REJECTED]
     *         description: Filter by clearance status
     *     responses:
     *       200:
     *         description: List of clearances retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PaginatedClearanceResponse'
     *             examples:
     *               success:
     *                 summary: Successful response with paginated clearances
     *                 value:
     *                   success: true
     *                   data:
     *                     data:
     *                       - id: "123e4567-e89b-12d3-a456-426614174000"
     *                         studentId: "123e4567-e89b-12d3-a456-426614174001"
     *                         status: "IN_REVIEW"
     *                         departmentStatus: "APPROVED"
     *                         academicStatus: "PENDING"
     *                         affairsStatus: "PENDING"
     *                         accountsStatus: "PENDING"
     *                         initiatedAt: "2024-01-15T10:30:00.000Z"
     *                         completedAt: null
     *                         createdAt: "2024-01-15T10:30:00.000Z"
     *                         updatedAt: "2024-01-16T14:20:00.000Z"
     *                     pagination:
     *                       page: 1
     *                       limit: 10
     *                       total: 25
     *                       totalPages: 3
     *                   message: "Clearances retrieved successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             example:
     *               success: false
     *               message: "Unauthorized"
     *       403:
     *         description: Forbidden - Insufficient permissions
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             example:
     *               success: false
     *               message: "Access denied. Required roles: ADMIN, HOD, DEAN, STUDENT_AFFAIRS, ACCOUNTS"
     */
    this.router.get('/', authMiddleware, roleMiddleware(Role.ADMIN, Role.HOD, Role.DEAN, Role.STUDENT_AFFAIRS, Role.ACCOUNTS), this.handleAsync(this.controller.getAll.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/clearance/initiate:
     *   post:
     *     summary: Initiate degree clearance request
     *     description: Initiate a new degree clearance request. Only available to STUDENT role. Each student can only have one active clearance request.
     *     tags: [Clearance]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: false
     *       description: No body required - student ID is taken from JWT token
     *     responses:
     *       201:
     *         description: Clearance initiated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/DegreeClearance'
     *                 message:
     *                   type: string
     *                   example: Clearance initiated successfully
     *             examples:
     *               success:
     *                 summary: Clearance initiated
     *                 value:
     *                   success: true
     *                   data:
     *                     id: "123e4567-e89b-12d3-a456-426614174000"
     *                     studentId: "123e4567-e89b-12d3-a456-426614174001"
     *                     status: "PENDING"
     *                     departmentStatus: "PENDING"
     *                     academicStatus: "PENDING"
     *                     affairsStatus: "PENDING"
     *                     accountsStatus: "PENDING"
     *                     initiatedAt: "2024-01-15T10:30:00.000Z"
     *                     completedAt: null
     *                     createdAt: "2024-01-15T10:30:00.000Z"
     *                     updatedAt: "2024-01-15T10:30:00.000Z"
     *                   message: "Clearance initiated successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             example:
     *               success: false
     *               message: "Unauthorized"
     *       403:
     *         description: Forbidden - Only students can initiate clearance
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             example:
     *               success: false
     *               message: "Only students can initiate clearance"
     *       409:
     *         description: Conflict - Clearance already initiated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             example:
     *               success: false
     *               message: "Clearance already initiated"
     */
    this.router.post('/initiate', authMiddleware, roleMiddleware(Role.STUDENT), this.handleAsync(this.controller.initiateClearance.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/clearance/my:
     *   get:
     *     summary: Get my clearance
     *     description: Retrieve the authenticated student's own clearance status. Only available to STUDENT role.
     *     tags: [Clearance]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Clearance retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/DegreeClearanceWithDetails'
     *                 message:
     *                   type: string
     *                   example: Clearance retrieved successfully
     *             examples:
     *               success:
     *                 summary: Student's clearance with details
     *                 value:
     *                   success: true
     *                   data:
     *                     id: "123e4567-e89b-12d3-a456-426614174000"
     *                     studentId: "123e4567-e89b-12d3-a456-426614174001"
     *                     status: "IN_REVIEW"
     *                     departmentStatus: "APPROVED"
     *                     academicStatus: "PENDING"
     *                     affairsStatus: "PENDING"
     *                     accountsStatus: "PENDING"
     *                     initiatedAt: "2024-01-15T10:30:00.000Z"
     *                     completedAt: null
     *                     createdAt: "2024-01-15T10:30:00.000Z"
     *                     updatedAt: "2024-01-16T14:20:00.000Z"
     *                     student:
     *                       id: "123e4567-e89b-12d3-a456-426614174001"
     *                       email: "student1@acadflow.edu"
     *                       firstName: "John"
     *                       lastName: "Doe"
     *                       role: "STUDENT"
     *                       studentId: "STU0001"
     *                       department: "Computer Science"
     *                     remarks:
     *                       - id: "123e4567-e89b-12d3-a456-426614174002"
     *                         department: "DEPARTMENT"
     *                         message: "All requirements verified."
     *                         clearanceId: "123e4567-e89b-12d3-a456-426614174000"
     *                         officerId: "123e4567-e89b-12d3-a456-426614174003"
     *                         createdAt: "2024-01-16T09:15:00.000Z"
     *                         officer:
     *                           id: "123e4567-e89b-12d3-a456-426614174003"
     *                           email: "hod@acadflow.edu"
     *                           firstName: "HOD"
     *                           lastName: "Department"
     *                           role: "HOD"
     *                   message: "Clearance retrieved successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *       403:
     *         description: Forbidden - Only students can view their clearance
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *       404:
     *         description: Clearance not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             example:
     *               success: false
     *               message: "Clearance not found"
     */
    this.router.get('/my', authMiddleware, roleMiddleware(Role.STUDENT), this.handleAsync(this.controller.getMyClearance.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/clearance/{id}:
     *   get:
     *     summary: Get clearance by ID
     *     description: Retrieve a specific clearance by its ID. Requires authentication.
     *     tags: [Clearance]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Clearance ID
     *     responses:
     *       200:
     *         description: Clearance retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/DegreeClearance'
     *                 message:
     *                   type: string
     *                   example: Clearance retrieved successfully
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Clearance not found
     */
    this.router.get('/:id', authMiddleware, this.handleAsync(this.controller.getOne.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/clearance/{id}/approve:
     *   put:
     *     summary: Approve department clearance
     *     description: Approve a department's clearance. Each role can only approve their respective department - HOD approves DEPARTMENT, DEAN approves ACADEMIC, STUDENT_AFFAIRS approves STUDENT_AFFAIRS, ACCOUNTS approves ACCOUNTS.
     *     tags: [Clearance]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Clearance ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - department
     *             properties:
     *               department:
     *                 type: string
     *                 enum: [DEPARTMENT, ACADEMIC, STUDENT_AFFAIRS, ACCOUNTS]
     *                 description: |
     *                   Department to approve. Each role can only approve their respective department:
     *                   - HOD → DEPARTMENT
     *                   - DEAN → ACADEMIC
     *                   - STUDENT_AFFAIRS → STUDENT_AFFAIRS
     *                   - ACCOUNTS → ACCOUNTS
     *                 example: DEPARTMENT
     *               message:
     *                 type: string
     *                 description: Optional approval message/remark (will be saved as a clearance remark)
     *                 example: All requirements met. Clearance approved.
     *           examples:
     *             hodApproval:
     *               summary: HOD approving department clearance
     *               value:
     *                 department: DEPARTMENT
     *                 message: "All department requirements have been verified and approved."
     *             deanApproval:
     *               summary: Dean approving academic clearance
     *               value:
     *                 department: ACADEMIC
     *                 message: "Academic records verified. Student is eligible for degree."
     *             withoutMessage:
     *               summary: Approval without message
     *               value:
     *                 department: ACCOUNTS
     *     responses:
     *       200:
     *         description: Department approved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/DegreeClearance'
     *                 message:
     *                   type: string
     *                   example: Department approved successfully
     *             examples:
     *               hodApproval:
     *                 summary: HOD approves department clearance
     *                 value:
     *                   success: true
     *                   data:
     *                     id: "123e4567-e89b-12d3-a456-426614174000"
     *                     studentId: "123e4567-e89b-12d3-a456-426614174001"
     *                     status: "IN_REVIEW"
     *                     departmentStatus: "APPROVED"
     *                     academicStatus: "PENDING"
     *                     affairsStatus: "PENDING"
     *                     accountsStatus: "PENDING"
     *                   message: "Department approved successfully"
     *       400:
     *         description: Bad request - Invalid input
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             example:
     *               success: false
     *               message: "Invalid department value"
     *       401:
     *         description: Unauthorized - Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *       403:
     *         description: Forbidden - Insufficient permissions to approve this department
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             example:
     *               success: false
     *               message: "You do not have permission to approve this department"
     *       404:
     *         description: Clearance not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     */
    this.router.put('/:id/approve', authMiddleware, roleMiddleware(Role.HOD, Role.DEAN, Role.STUDENT_AFFAIRS, Role.ACCOUNTS), this.handleAsync(this.controller.approveDepartment.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/clearance/{id}/reject:
     *   put:
     *     summary: Reject department clearance
     *     description: Reject a department's clearance. Each role can only reject their respective department. A rejection message is required.
     *     tags: [Clearance]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Clearance ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - department
     *               - message
     *             properties:
     *               department:
     *                 type: string
     *                 enum: [DEPARTMENT, ACADEMIC, STUDENT_AFFAIRS, ACCOUNTS]
     *                 description: |
     *                   Department to reject. Each role can only reject their respective department:
     *                   - HOD → DEPARTMENT
     *                   - DEAN → ACADEMIC
     *                   - STUDENT_AFFAIRS → STUDENT_AFFAIRS
     *                   - ACCOUNTS → ACCOUNTS
     *                 example: ACCOUNTS
     *               message:
     *                 type: string
     *                 minLength: 1
     *                 description: Rejection reason (required - will be saved as a clearance remark)
     *                 example: Outstanding dues must be cleared before approval.
     *           examples:
     *             accountsRejection:
     *               summary: Accounts office rejecting due to dues
     *               value:
     *                 department: ACCOUNTS
     *                 message: "Outstanding dues of $500 must be cleared before approval."
     *             departmentRejection:
     *               summary: Department rejecting clearance
     *               value:
     *                 department: DEPARTMENT
     *                 message: "Missing required documentation. Please submit all necessary forms."
     *             affairsRejection:
     *               summary: Student Affairs rejecting clearance
     *               value:
     *                 department: STUDENT_AFFAIRS
     *                 message: "Library books not returned. Please return all borrowed materials."
     *     responses:
     *       200:
     *         description: Department rejected
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/DegreeClearance'
     *                 message:
     *                   type: string
     *                   example: Department rejected
     *             examples:
     *               rejection:
     *                 summary: Department rejection example
     *                 value:
     *                   success: true
     *                   data:
     *                     id: "123e4567-e89b-12d3-a456-426614174000"
     *                     studentId: "123e4567-e89b-12d3-a456-426614174001"
     *                     status: "REJECTED"
     *                     departmentStatus: "PENDING"
     *                     academicStatus: "PENDING"
     *                     affairsStatus: "PENDING"
     *                     accountsStatus: "REJECTED"
     *                   message: "Department rejected"
     *       400:
     *         description: Bad request - Invalid input or missing rejection message
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             examples:
     *               missingMessage:
     *                 summary: Missing rejection message
     *                 value:
     *                   success: false
     *                   message: "Rejection message is required"
     *               invalidDepartment:
     *                 summary: Invalid department
     *                 value:
     *                   success: false
     *                   message: "Invalid department value"
     *       401:
     *         description: Unauthorized - Authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *       403:
     *         description: Forbidden - Insufficient permissions to reject this department
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     *             example:
     *               success: false
     *               message: "You do not have permission to reject this department"
     *       404:
     *         description: Clearance not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiError'
     */
    this.router.put('/:id/reject', authMiddleware, roleMiddleware(Role.HOD, Role.DEAN, Role.STUDENT_AFFAIRS, Role.ACCOUNTS), this.handleAsync(this.controller.rejectDepartment.bind(this.controller)));
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

export default new ClearanceRoutes().getRouter();
