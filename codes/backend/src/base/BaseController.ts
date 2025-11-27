import { Request, Response, NextFunction } from 'express';
import { BaseService } from './BaseService';
import { ApiResponseHandler } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';
import { PaginationParams, FilterParams } from '../types';
import logger from '../utils/logger';

export abstract class BaseController<T, CreateInput, UpdateInput, WhereInput> {
  protected service: BaseService<T, CreateInput, UpdateInput, WhereInput>;
  abstract modelName: string;

  constructor(service: BaseService<T, CreateInput, UpdateInput, WhereInput>) {
    this.service = service;
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: PaginationParams & FilterParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        ...req.query,
      };

      const result = await this.service.findAll(params);
      ApiResponseHandler.success(res, result, `${this.modelName}s retrieved successfully`);
    } catch (error) {
      logger.error(`Error in getAll ${this.modelName}`, { error });
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const item = await this.service.findOne(id);

      if (!item) {
        ApiResponseHandler.notFound(res, `${this.modelName} not found`);
        return;
      }

      ApiResponseHandler.success(res, item, `${this.modelName} retrieved successfully`);
    } catch (error) {
      logger.error(`Error in getOne ${this.modelName}`, { error, id: req.params.id });
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as CreateInput;
      const item = await this.service.create(data);
      ApiResponseHandler.created(res, item, `${this.modelName} created successfully`);
    } catch (error: any) {
      logger.error(`Error in create ${this.modelName}`, { error, body: req.body });

      // Handle Prisma unique constraint errors
      if (error?.code === 'P2002') {
        ApiResponseHandler.conflict(res, `${this.modelName} already exists`);
        return;
      }

      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body as UpdateInput;

      // Check if item exists
      const existing = await this.service.findOne(id);
      if (!existing) {
        ApiResponseHandler.notFound(res, `${this.modelName} not found`);
        return;
      }

      const item = await this.service.update(id, data);
      ApiResponseHandler.success(res, item, `${this.modelName} updated successfully`);
    } catch (error: any) {
      logger.error(`Error in update ${this.modelName}`, { error, id: req.params.id, body: req.body });

      if (error?.code === 'P2025') {
        ApiResponseHandler.notFound(res, `${this.modelName} not found`);
        return;
      }

      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if item exists
      const existing = await this.service.findOne(id);
      if (!existing) {
        ApiResponseHandler.notFound(res, `${this.modelName} not found`);
        return;
      }

      await this.service.delete(id);
      ApiResponseHandler.noContent(res);
    } catch (error: any) {
      logger.error(`Error in delete ${this.modelName}`, { error, id: req.params.id });

      if (error?.code === 'P2025') {
        ApiResponseHandler.notFound(res, `${this.modelName} not found`);
        return;
      }

      next(error);
    }
  };
}

