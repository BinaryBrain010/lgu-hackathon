import { Evaluation, EvaluationType, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { BaseService } from '../base/BaseService';
import { FilterParams } from '../types';

type EvaluationCreateInput = Prisma.EvaluationCreateInput;
type EvaluationUpdateInput = Prisma.EvaluationUpdateInput;
type EvaluationWhereInput = Prisma.EvaluationWhereInput;

export class EvaluationService extends BaseService<
  Evaluation,
  EvaluationCreateInput,
  EvaluationUpdateInput,
  EvaluationWhereInput
> {
  protected model = prisma.evaluation;

  async findByFYPId(fypId: string): Promise<Evaluation[]> {
    return await this.model.findMany({
      where: { fypId },
      include: {
        evaluator: true,
      },
    });
  }

  async findByEvaluatorId(evaluatorId: string): Promise<Evaluation[]> {
    return await this.model.findMany({
      where: { evaluatorId },
      include: {
        fyp: {
          include: {
            student: true,
          },
        },
      },
    });
  }

  async findByType(fypId: string, type: EvaluationType): Promise<Evaluation | null> {
    return await this.model.findFirst({
      where: { fypId, type },
      include: {
        evaluator: true,
      },
    });
  }

  async createOrUpdate(
    fypId: string,
    evaluatorId: string,
    type: EvaluationType,
    marks: number,
    feedback?: string
  ): Promise<Evaluation> {
    try {
      // Check if evaluation already exists
      const existing = await this.model.findUnique({
        where: {
          fypId_evaluatorId_type: {
            fypId,
            evaluatorId,
            type,
          },
        },
      });

      if (existing) {
        return await this.update(existing.id, {
          marks,
          feedback,
          evaluatedAt: new Date(),
        });
      }

      return await this.create({
        fypId,
        evaluatorId,
        type,
        marks,
        feedback,
        evaluatedAt: new Date(),
      } as EvaluationCreateInput);
    } catch (error) {
      throw error;
    }
  }

  protected buildWhereClause(params: FilterParams): EvaluationWhereInput {
    const where: EvaluationWhereInput = {};

    if (params.fypId) {
      where.fypId = params.fypId as string;
    }

    if (params.evaluatorId) {
      where.evaluatorId = params.evaluatorId as string;
    }

    if (params.type) {
      where.type = params.type as EvaluationType;
    }

    return where;
  }
}

