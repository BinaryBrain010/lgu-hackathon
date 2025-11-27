import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../service/auth.service';
import { ApiResponseHandler } from '../../../utils/response';
import logger from '../../../utils/logger';

// Accept either 'email' or 'username' field (both should be valid email format)
const loginSchema = z
  .object({
    email: z.string().email('Invalid email format').optional(),
    username: z.string().email('Invalid email format').optional(),
    password: z.string().min(1, 'Password is required'),
  })
  .refine((data) => data.email || data.username, {
    message: 'Either email or username is required',
    path: ['email'],
  });

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = loginSchema.parse(req.body);
      // Use email if provided, otherwise use username (both should be email format)
      const email = validatedData.email || validatedData.username || '';
      const { password } = validatedData;

      if (!email) {
        ApiResponseHandler.badRequest(res, 'Email or username is required');
        return;
      }

      const result = await this.authService.login(email, password);

      ApiResponseHandler.success(res, {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role,
        },
        token: result.token,
        permissions: result.permissions,
      }, 'Login successful');
    } catch (error: any) {
      logger.error('Login controller error', { error, body: req.body });

      if (error instanceof z.ZodError) {
        ApiResponseHandler.badRequest(res, error.errors[0].message);
        return;
      }

      if (error.message === 'Invalid credentials') {
        ApiResponseHandler.unauthorized(res, error.message);
        return;
      }

      next(error);
    }
  };
}

