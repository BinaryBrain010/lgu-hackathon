import { FYP, FYPStage, Prisma, User } from '@prisma/client';
import prisma from '../config/database';
import { BaseService } from '../base/BaseService';
import { FilterParams, FYPStageTransition } from '../types';
import { VALID_STAGE_TRANSITIONS } from '../utils/constants';
import logger from '../utils/logger';

type FYPCreateInput = Prisma.FYPCreateInput;
type FYPUpdateInput = Prisma.FYPUpdateInput;
type FYPWhereInput = Prisma.FYPWhereInput;

export class FYPService extends BaseService<FYP, FYPCreateInput, FYPUpdateInput, FYPWhereInput> {
  protected model = prisma.fYP;

  async findAll(
    params: any = {}
  ): Promise<any> {
    try {
      const page = params.page || 1;
      const limit = Math.min(params.limit || 10, 100);
      const skip = (page - 1) * limit;

      const where = this.buildWhereClause(params);

      const [data, total] = await Promise.all([
        this.model.findMany({
          where,
          skip,
          take: limit,
          include: {
            student: true,
            supervisor: true,
            documents: true,
          },
          orderBy: { createdAt: 'desc' } as any,
        }),
        this.model.count({ where }),
      ]);

      return {
        data: data as FYP[],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error in findAll', { error });
      throw error;
    }
  }

  async findByStudentId(studentId: string): Promise<FYP[]> {
    return await this.model.findMany({
      where: { studentId },
      include: {
        student: true,
        supervisor: true,
        documents: true,
      },
    });
  }

  async findBySupervisorId(supervisorId: string): Promise<FYP[]> {
    return await this.model.findMany({
      where: { supervisorId },
      include: {
        student: true,
        supervisor: true,
        documents: true,
      },
    });
  }

  async findByStage(stage: FYPStage): Promise<FYP[]> {
    return await this.model.findMany({
      where: { stage },
      include: {
        student: true,
        supervisor: true,
      },
    });
  }

  async canTransitionStage(currentStage: FYPStage, newStage: FYPStage): Promise<boolean> {
    const allowedStages = VALID_STAGE_TRANSITIONS[currentStage];
    return allowedStages.includes(newStage);
  }

  async updateStage(fypId: string, newStage: FYPStage, userId: string): Promise<FYP> {
    try {
      const fyp = await this.findOne(fypId);
      if (!fyp) {
        throw new Error('FYP not found');
      }

      // Validate stage transition
      const canTransition = await this.canTransitionStage(fyp.stage, newStage);
      if (!canTransition) {
        throw new Error(`Invalid stage transition from ${fyp.stage} to ${newStage}`);
      }

      // Update stage with timestamps
      const updateData: any = { stage: newStage };

      // Set appropriate timestamps based on stage
      if (newStage === FYPStage.IDEA_APPROVED && !fyp.ideaApprovedAt) {
        updateData.ideaApprovedAt = new Date();
      }
      if (newStage === FYPStage.PROPOSAL_APPROVED && !fyp.proposalApprovedAt) {
        updateData.proposalApprovedAt = new Date();
      }
      if (newStage === FYPStage.SRS_APPROVED && !fyp.srsApprovedAt) {
        updateData.srsApprovedAt = new Date();
      }
      if (newStage === FYPStage.INTERNAL_DONE && !fyp.internalCompletedAt) {
        updateData.internalCompletedAt = new Date();
      }
      if (newStage === FYPStage.EXTERNAL_DONE && !fyp.externalCompletedAt) {
        updateData.externalCompletedAt = new Date();
      }
      if (newStage === FYPStage.COMPLETED && !fyp.completedAt) {
        updateData.completedAt = new Date();
      }

      const updated = await this.update(fypId, updateData);

      // Create notification for stage change
      await this.createStageChangeNotification(fypId, fyp.stage, newStage, userId);

      return updated;
    } catch (error) {
      logger.error('Error updating FYP stage', { error, fypId, newStage });
      throw error;
    }
  }

  private async createStageChangeNotification(
    fypId: string,
    oldStage: FYPStage,
    newStage: FYPStage,
    changedById: string
  ): Promise<void> {
    try {
      const fyp = await this.model.findUnique({
        where: { id: fypId },
        include: { student: true },
      });

      if (!fyp) return;

      await prisma.notification.create({
        data: {
          userId: fyp.studentId,
          title: 'FYP Stage Updated',
          message: `Your FYP "${fyp.title}" has moved from ${oldStage} to ${newStage}`,
          fypId,
        },
      });

      // Also notify supervisor if assigned
      if (fyp.supervisorId) {
        await prisma.notification.create({
          data: {
            userId: fyp.supervisorId,
            title: 'FYP Stage Updated',
            message: `FYP "${fyp.title}" has moved from ${oldStage} to ${newStage}`,
            fypId,
          },
        });
      }
    } catch (error) {
      logger.error('Error creating stage change notification', { error });
    }
  }

  async checkDuplicateTitle(title: string, excludeId?: string): Promise<boolean> {
    const existing = await this.model.findFirst({
      where: {
        title: { equals: title, mode: 'insensitive' },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return !!existing;
  }

  protected buildWhereClause(params: FilterParams): FYPWhereInput {
    const where: FYPWhereInput = {};

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.stage) {
      where.stage = params.stage as FYPStage;
    }

    if (params.studentId) {
      where.studentId = params.studentId as string;
    }

    if (params.supervisorId) {
      where.supervisorId = params.supervisorId as string;
    }

    return where;
  }
}

