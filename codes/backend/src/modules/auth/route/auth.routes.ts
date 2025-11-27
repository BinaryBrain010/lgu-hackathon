import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controller/auth.controller';

export class AuthRoutes {
  private router: Router;
  private controller: AuthController;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    /**
     * @swagger
     * /api/v1/auth/login:
     *   post:
     *     summary: User login
     *     description: Authenticate user and receive JWT token with role-based permissions. Accepts either 'email' or 'username' field (both must be valid email format).
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: student1@acadflow.edu
     *                 description: User email address (optional if username is provided)
     *               username:
     *                 type: string
     *                 format: email
     *                 example: student1@acadflow.edu
     *                 description: User email/username (optional if email is provided)
     *               password:
     *                 type: string
     *                 format: password
     *                 example: student123
     *                 description: User password
     *           examples:
     *             emailLogin:
     *               summary: Login with email
     *               value:
     *                 email: student1@acadflow.edu
     *                 password: student123
     *             usernameLogin:
     *               summary: Login with username
     *               value:
     *                 username: student1@acadflow.edu
     *                 password: student123
     *     responses:
     *       200:
     *         description: Login successful
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
     *                     user:
     *                       type: object
     *                       properties:
     *                         id:
     *                           type: string
     *                           format: uuid
     *                         email:
     *                           type: string
     *                         firstName:
     *                           type: string
     *                         lastName:
     *                           type: string
     *                         role:
     *                           type: string
     *                           enum: [STUDENT, SUPERVISOR, EXAMINER, HOD, DEAN, STUDENT_AFFAIRS, ACCOUNTS, ADMIN]
     *                     token:
     *                       type: string
     *                       description: JWT authentication token
     *                     permissions:
     *                       type: array
     *                       items:
     *                         type: string
     *                       description: Array of role-based permissions in format 'resource:action'
     *                       example: ["fyp:submit_idea", "fyp:select_supervisor", "clearance:submit_request"]
     *                 message:
     *                   type: string
     *                   example: Login successful
     *       400:
     *         description: Validation error - Either email or username is required
     *       401:
     *         description: Invalid credentials
     */
    this.router.post('/login', this.handleAsync(this.controller.login.bind(this.controller)));
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

export default new AuthRoutes().getRouter();
