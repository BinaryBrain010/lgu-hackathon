import { Response } from 'express';
import { HTTP_STATUS } from './constants';
import { ApiResponse } from '../types';

export class ApiResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = HTTP_STATUS.OK
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      ...(message && { message }),
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    error?: any
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      ...(error && process.env.NODE_ENV !== 'production' && { error }),
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message?: string
  ): Response {
    return this.success(res, data, message || 'Resource created successfully', HTTP_STATUS.CREATED);
  }

  static noContent(res: Response): Response {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  static badRequest(res: Response, message: string): Response {
    return this.error(res, message, HTTP_STATUS.BAD_REQUEST);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, HTTP_STATUS.FORBIDDEN);
  }

  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, HTTP_STATUS.NOT_FOUND);
  }

  static conflict(res: Response, message: string): Response {
    return this.error(res, message, HTTP_STATUS.CONFLICT);
  }

  static unprocessableEntity(res: Response, message: string): Response {
    return this.error(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }
}

