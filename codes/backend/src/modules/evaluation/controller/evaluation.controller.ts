import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { EvaluationType } from '@prisma/client';
import { EvaluationService } from '../service/evaluation.service';
import { BaseController } from '../../../base/BaseController';
import { ApiResponseHandler } from '../../../utils/response';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { EVALUATION } from '../../../utils/constants';

const submitEvaluationSchema = z.object({
  fypId: z.string().uuid('Invalid FYP ID'),
  type: z.nativeEnum(EvaluationType),
  marks: z.number().min(EVALUATION.MIN_MARKS).max(EVALUATION.MAX_MARKS),
  feedback: z.string().optional(),
});

export class EvaluationController extends BaseController<any, any, any, any> {
  modelName = 'Evaluation';
  private evaluationService: EvaluationService;

  constructor() {
    super(new EvaluationService());
    this.evaluationService = new EvaluationService();
  }

  submitEvaluation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      if (req.user.role !== 'EXAMINER') {
        ApiResponseHandler.forbidden(res, 'Only examiners can submit evaluations');
        return;
      }

      const validatedData = submitEvaluationSchema.parse(req.body);
      const evaluation = await this.evaluationService.createOrUpdate(
        validatedData.fypId,
        req.user.userId,
        validatedData.type,
        validatedData.marks,
        validatedData.feedback
      );

      ApiResponseHandler.success(res, evaluation, 'Evaluation submitted successfully');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        ApiResponseHandler.badRequest(res, error.errors[0].message);
        return;
      }
      next(error);
    }
  };

  getFYPEvaluations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { fypId } = req.params;
      const evaluations = await this.evaluationService.findByFYPId(fypId);
      ApiResponseHandler.success(res, evaluations, 'Evaluations retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getMyEvaluations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const evaluations = await this.evaluationService.findByEvaluatorId(req.user.userId);
      ApiResponseHandler.success(res, evaluations, 'Evaluations retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}

