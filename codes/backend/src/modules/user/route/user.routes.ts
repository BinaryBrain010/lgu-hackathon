import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controller/user.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User management endpoints
 */

export class UserRoutes {
  private router: Router;
  private controller: UserController;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    /**
     * @swagger
     * /api/v1/user:
     *   get:
     *     summary: Get all users
     *     description: Retrieve all users with pagination and filtering. Available to all authenticated users.
     *     tags: [User]
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
     *         name: role
     *         schema:
     *           type: string
     *           enum: [STUDENT, SUPERVISOR, EXAMINER, HOD, DEAN, STUDENT_AFFAIRS, ACCOUNTS, ADMIN]
     *         description: Filter by user role
     *       - in: query
     *         name: department
     *         schema:
     *           type: string
     *         description: Filter by department
     *     responses:
     *       200:
     *         description: List of users retrieved successfully
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
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/User'
     *                     pagination:
     *                       type: object
     *                       properties:
     *                         page:
     *                           type: integer
     *                         limit:
     *                           type: integer
     *                         total:
     *                           type: integer
     *                         totalPages:
     *                           type: integer
     *                 message:
     *                   type: string
     *                   example: "Users retrieved successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *   post:
     *     summary: Create new user
     *     description: Create a new user. Available to authenticated users.
     *     tags: [User]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - firstName
     *               - lastName
     *               - role
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: User email address (must be unique)
     *                 example: "student2@acadflow.edu"
     *               password:
     *                 type: string
     *                 format: password
     *                 description: User password
     *                 example: "password123"
     *               firstName:
     *                 type: string
     *                 description: User first name
     *                 example: "Jane"
     *               lastName:
     *                 type: string
     *                 description: User last name
     *                 example: "Smith"
     *               role:
     *                 type: string
     *                 enum: [STUDENT, SUPERVISOR, EXAMINER, HOD, DEAN, STUDENT_AFFAIRS, ACCOUNTS, ADMIN]
     *                 description: User role
     *                 example: "STUDENT"
     *               studentId:
     *                 type: string
     *                 description: Student ID (required for STUDENT role)
     *                 example: "STU0002"
     *               department:
     *                 type: string
     *                 description: Department name
     *                 example: "Computer Science"
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *                 message:
     *                   type: string
     *                   example: "User created successfully"
     *       400:
     *         description: Bad request - Invalid input
     *       401:
     *         description: Unauthorized - Authentication required
     *       409:
     *         description: Conflict - User with this email already exists
     */
    this.router.get('/', authMiddleware, this.handleAsync(this.controller.getAll.bind(this.controller)));
    this.router.post('/', authMiddleware, this.handleAsync(this.controller.create.bind(this.controller)));

    /**
     * @swagger
     * /api/v1/user/{id}:
     *   get:
     *     summary: Get user by ID
     *     description: Retrieve a specific user by their ID. Available to all authenticated users.
     *     tags: [User]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: User ID
     *     responses:
     *       200:
     *         description: User retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *                 message:
     *                   type: string
     *                   example: "User retrieved successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: User not found
     *   put:
     *     summary: Update user
     *     description: Update user information. Available to authenticated users.
     *     tags: [User]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: User ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: User email address
     *               firstName:
     *                 type: string
     *                 description: User first name
     *               lastName:
     *                 type: string
     *                 description: User last name
     *               role:
     *                 type: string
     *                 enum: [STUDENT, SUPERVISOR, EXAMINER, HOD, DEAN, STUDENT_AFFAIRS, ACCOUNTS, ADMIN]
     *                 description: User role
     *               studentId:
     *                 type: string
     *                 description: Student ID
     *               department:
     *                 type: string
     *                 description: Department name
     *     responses:
     *       200:
     *         description: User updated successfully
     *       400:
     *         description: Bad request - Invalid input
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: User not found
     *   delete:
     *     summary: Delete user
     *     description: Delete a user by ID. Available to authenticated users.
     *     tags: [User]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: User ID
     *     responses:
     *       204:
     *         description: User deleted successfully (no content)
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: User not found
     */
    this.router.get('/:id', authMiddleware, this.handleAsync(this.controller.getOne.bind(this.controller)));
    this.router.put('/:id', authMiddleware, this.handleAsync(this.controller.update.bind(this.controller)));
    this.router.delete('/:id', authMiddleware, this.handleAsync(this.controller.delete.bind(this.controller)));
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

export default new UserRoutes().getRouter();
