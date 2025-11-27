import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { FYPStage, DocumentType } from '@prisma/client';
import { FYPService } from '../service/fyp.service';
import { BaseController } from '../../../base/BaseController';
import { ApiResponseHandler } from '../../../utils/response';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { EVALUATION, PLAGIARISM } from '../../../utils/constants';
import logger from '../../../utils/logger';

const createIdeaSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
});

const assignSupervisorSchema = z.object({
  supervisorId: z.string().uuid('Invalid supervisor ID'),
});

const uploadDocumentSchema = z.object({
  type: z.nativeEnum(DocumentType),
  fileUrl: z.string().url('Invalid file URL'),
  version: z.number().int().positive().optional(),
});

const updateStageSchema = z.object({
  stage: z.nativeEnum(FYPStage),
});

const uploadPlagiarismSchema = z.object({
  similarity: z.number().min(0).max(100),
  reportUrl: z.string().url('Invalid report URL'),
});

export class FYPController extends BaseController<any, any, any, any> {
  modelName = 'FYP';
  private fypService: FYPService;

  constructor() {
    super(new FYPService());
    this.fypService = new FYPService();
  }

  submitIdea = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const validatedData = createIdeaSchema.parse(req.body);
      const isDuplicate = await this.fypService.checkDuplicateTitle(validatedData.title);
      if (isDuplicate) {
        ApiResponseHandler.conflict(res, 'An FYP with this title already exists');
        return;
      }

      const fyp = await this.fypService.create({
        title: validatedData.title,
        description: validatedData.description,
        stage: FYPStage.IDEA_PENDING,
        studentId: req.user.userId,
      });

      ApiResponseHandler.created(res, fyp, 'FYP idea submitted successfully');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        ApiResponseHandler.badRequest(res, error.errors[0].message);
        return;
      }
      next(error);
    }
  };

  assignSupervisor = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const validatedData = assignSupervisorSchema.parse(req.body);
      const fyp = await this.fypService.findOne(id);
      if (!fyp) {
        ApiResponseHandler.notFound(res, 'FYP not found');
        return;
      }

      if (fyp.studentId !== req.user.userId) {
        ApiResponseHandler.forbidden(res, 'You can only assign supervisor to your own FYP');
        return;
      }

      if (fyp.stage !== FYPStage.SUPERVISOR_PENDING) {
        ApiResponseHandler.badRequest(res, 'FYP must be in SUPERVISOR_PENDING stage');
        return;
      }

      const updated = await this.fypService.update(id, {
        supervisorId: validatedData.supervisorId,
        stage: FYPStage.SUPERVISOR_ASSIGNED,
      });

      ApiResponseHandler.success(res, updated, 'Supervisor assigned successfully');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        ApiResponseHandler.badRequest(res, error.errors[0].message);
        return;
      }
      next(error);
    }
  };

  uploadDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const validatedData = uploadDocumentSchema.parse(req.body);
      const fyp = await this.fypService.findOne(id);
      if (!fyp) {
        ApiResponseHandler.notFound(res, 'FYP not found');
        return;
      }

      if (fyp.studentId !== req.user.userId && fyp.supervisorId !== req.user.userId) {
        ApiResponseHandler.forbidden(res, 'Unauthorized to upload documents for this FYP');
        return;
      }

      const prisma = (await import('../../../config/database')).default;
      const latestDoc = await prisma.fYPDocument.findFirst({
        where: { fypId: id, type: validatedData.type },
        orderBy: { version: 'desc' },
      });

      const version = validatedData.version || (latestDoc ? latestDoc.version + 1 : 1);
      const document = await prisma.fYPDocument.create({
        data: { fypId: id, type: validatedData.type, fileUrl: validatedData.fileUrl, version },
      });

      let newStage: FYPStage | null = null;
      if (validatedData.type === DocumentType.PROPOSAL && fyp.stage === FYPStage.SUPERVISOR_ASSIGNED) {
        newStage = FYPStage.PROPOSAL_PENDING;
      } else if (validatedData.type === DocumentType.SRS && fyp.stage === FYPStage.PROPOSAL_APPROVED) {
        newStage = FYPStage.SRS_PENDING;
      }

      if (newStage) {
        await this.fypService.updateStage(id, newStage, req.user.userId);
      }

      ApiResponseHandler.created(res, document, 'Document uploaded successfully');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        ApiResponseHandler.badRequest(res, error.errors[0].message);
        return;
      }
      next(error);
    }
  };

  updateStage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const validatedData = updateStageSchema.parse(req.body);
      const fyp = await this.fypService.findOne(id);
      if (!fyp) {
        ApiResponseHandler.notFound(res, 'FYP not found');
        return;
      }

      const canTransition = await this.fypService.canTransitionStage(fyp.stage, validatedData.stage);
      if (!canTransition) {
        ApiResponseHandler.badRequest(res, `Cannot transition from ${fyp.stage} to ${validatedData.stage}`);
        return;
      }

      const updated = await this.fypService.updateStage(id, validatedData.stage, req.user.userId);
      ApiResponseHandler.success(res, updated, 'FYP stage updated successfully');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        ApiResponseHandler.badRequest(res, error.errors[0].message);
        return;
      }
      if (error.message?.includes('Invalid stage transition')) {
        ApiResponseHandler.badRequest(res, error.message);
        return;
      }
      next(error);
    }
  };

  uploadPlagiarismReport = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const validatedData = uploadPlagiarismSchema.parse(req.body);
      const fyp = await this.fypService.findOne(id);
      if (!fyp) {
        ApiResponseHandler.notFound(res, 'FYP not found');
        return;
      }

      if (validatedData.similarity > PLAGIARISM.THRESHOLD) {
        ApiResponseHandler.badRequest(res, `Plagiarism similarity (${validatedData.similarity}%) exceeds threshold (${PLAGIARISM.THRESHOLD}%)`);
        return;
      }

      const prisma = (await import('../../../config/database')).default;
      const report = await prisma.plagiarismReport.create({
        data: { fypId: id, similarity: validatedData.similarity, reportUrl: validatedData.reportUrl, uploadedById: req.user.userId },
      });

      ApiResponseHandler.created(res, report, 'Plagiarism report uploaded successfully');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        ApiResponseHandler.badRequest(res, error.errors[0].message);
        return;
      }
      next(error);
    }
  };

  getMyFYPs = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      if (req.user.role === 'STUDENT') {
        const fyps = await this.fypService.findByStudentId(req.user.userId);
        ApiResponseHandler.success(res, fyps, 'FYPs retrieved successfully');
      } else if (req.user.role === 'SUPERVISOR') {
        const fyps = await this.fypService.findBySupervisorId(req.user.userId);
        ApiResponseHandler.success(res, fyps, 'FYPs retrieved successfully');
      } else {
        ApiResponseHandler.forbidden(res, 'Only students and supervisors can view their FYPs');
      }
    } catch (error) {
      next(error);
    }
  };
}

