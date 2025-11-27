import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { ApiResponseHandler } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';
import logger from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorMiddleware = (
  err: Error | AppError | ZodError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response | void => {
  // Log error
  logger.error('Error occurred', {
    error: err,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
  });

  // Handle known AppError
  if (err instanceof AppError) {
    return ApiResponseHandler.error(res, err.message, err.statusCode);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    return ApiResponseHandler.error(
      res,
      'Validation failed',
      HTTP_STATUS.BAD_REQUEST,
      errors
    );
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return ApiResponseHandler.conflict(res, 'Record already exists');
    }
    if (err.code === 'P2025') {
      return ApiResponseHandler.notFound(res, 'Record not found');
    }
    if (err.code === 'P2003') {
      return ApiResponseHandler.badRequest(res, 'Foreign key constraint failed');
    }
  }

  // Handle Prisma validation errors
    if (err instanceof Prisma.PrismaClientValidationError) {
      return ApiResponseHandler.badRequest(res, 'Invalid data provided');
    }

    // Default error
    const message = (process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message) || 'Internal server error';

    return ApiResponseHandler.error(res, message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  };

