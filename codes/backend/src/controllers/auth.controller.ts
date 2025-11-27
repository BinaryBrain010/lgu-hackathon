import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { ApiResponseHandler } from '../utils/response';
import logger from '../utils/logger';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['STUDENT', 'SUPERVISOR', 'EXAMINER', 'HOD', 'DEAN', 'STUDENT_AFFAIRS', 'ACCOUNTS', 'ADMIN']).optional(),
});

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password, role } = validatedData;

      const result = await this.authService.login(email, password, role);

      ApiResponseHandler.success(res, {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role,
        },
        token: result.token,
      }, 'Login successful');
    } catch (error: any) {
      logger.error('Login controller error', { error, body: req.body });

      if (error instanceof z.ZodError) {
        ApiResponseHandler.badRequest(res, error.errors[0].message);
        return;
      }

      if (error.message === 'Invalid credentials' || error.message.includes('does not have')) {
        ApiResponseHandler.unauthorized(res, error.message);
        return;
      }

      next(error);
    }
  };
}

