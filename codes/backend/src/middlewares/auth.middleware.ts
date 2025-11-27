import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { JWTPayload } from '../types';
import { ApiResponseHandler } from '../utils/response';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7);

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as JWTPayload;
      req.user = decoded;
      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Token expired', 401);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Invalid token', 401);
      }
      throw new AppError('Authentication failed', 401);
    }
  } catch (error) {
    if (error instanceof AppError) {
      ApiResponseHandler.error(res, error.message, error.statusCode);
      return;
    }
    ApiResponseHandler.unauthorized(res);
  }
};

