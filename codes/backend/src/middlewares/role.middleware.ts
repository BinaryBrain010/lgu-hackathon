import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthRequest } from './auth.middleware';
import { ApiResponseHandler } from '../utils/response';
import { AppError } from './error.middleware';

export const roleMiddleware = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError(
          `Access denied. Required roles: ${allowedRoles.join(', ')}`,
          403
        );
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        ApiResponseHandler.error(res, error.message, error.statusCode);
        return;
      }
      ApiResponseHandler.forbidden(res);
    }
  };
};

