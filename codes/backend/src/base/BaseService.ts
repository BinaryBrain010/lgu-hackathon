import { PrismaClient, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { PaginationParams, FilterParams, PaginatedResponse } from '../types';
import { PAGINATION } from '../utils/constants';
import logger from '../utils/logger';

export abstract class BaseService<T, CreateInput, UpdateInput, WhereInput> {
  protected prisma: PrismaClient;
  protected abstract model: any;

  constructor() {
    this.prisma = prisma;
  }

  async findAll(
    params: PaginationParams & FilterParams = {}
  ): Promise<PaginatedResponse<T>> {
    try {
      const page = params.page || PAGINATION.DEFAULT_PAGE;
      const limit = Math.min(params.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
      const skip = (page - 1) * limit;

      const where = this.buildWhereClause(params);

      const [data, total] = await Promise.all([
        this.model.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' } as any,
        }),
        this.model.count({ where }),
      ]);

      return {
        data: data as T[],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error in findAll', { error, model: this.model });
      throw error;
    }
  }

  async findOne(id: string): Promise<T | null> {
    try {
      const result = await this.model.findUnique({
        where: { id } as any,
      });
      return result as T | null;
    } catch (error) {
      logger.error('Error in findOne', { error, id, model: this.model });
      throw error;
    }
  }

  async findBy(where: WhereInput): Promise<T | null> {
    try {
      const result = await this.model.findFirst({
        where: where as any,
      });
      return result as T | null;
    } catch (error) {
      logger.error('Error in findBy', { error, where, model: this.model });
      throw error;
    }
  }

  async create(data: CreateInput): Promise<T> {
    try {
      const result = await this.model.create({
        data: data as any,
      });
      return result as T;
    } catch (error) {
      logger.error('Error in create', { error, data, model: this.model });
      throw error;
    }
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    try {
      const result = await this.model.update({
        where: { id } as any,
        data: data as any,
      });
      return result as T;
    } catch (error) {
      logger.error('Error in update', { error, id, data, model: this.model });
      throw error;
    }
  }

  async delete(id: string): Promise<T> {
    try {
      const result = await this.model.delete({
        where: { id } as any,
      });
      return result as T;
    } catch (error) {
      logger.error('Error in delete', { error, id, model: this.model });
      throw error;
    }
  }

  async count(where?: WhereInput): Promise<number> {
    try {
      return await this.model.count({
        where: where as any,
      });
    } catch (error) {
      logger.error('Error in count', { error, where, model: this.model });
      throw error;
    }
  }

  protected buildWhereClause(params: FilterParams): WhereInput {
    // Override in child classes for custom filtering
    return {} as WhereInput;
  }
}

