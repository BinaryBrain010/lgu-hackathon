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
     *     description: Authenticate user and receive JWT token. Role parameter is optional for development/mock purposes.
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: student1@acadflow.edu
     *                 description: User email address
     *               password:
     *                 type: string
     *                 format: password
     *                 example: student123
     *                 description: User password
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
     *                     token:
     *                       type: string
     *                       description: JWT authentication token
     *                 message:
     *                   type: string
     *                   example: Login successful
     *       400:
     *         description: Validation error
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
