import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ClearanceStatus, ClearanceDepartment } from '@prisma/client';
import { ClearanceService } from '../service/clearance.service';
import { BaseController } from '../../../base/BaseController';
import { ApiResponseHandler } from '../../../utils/response';
import { AuthRequest } from '../../../middlewares/auth.middleware';

const approveDepartmentSchema = z.object({
  department: z.nativeEnum(ClearanceDepartment),
  message: z.string().optional(),
});

const rejectDepartmentSchema = z.object({
  department: z.nativeEnum(ClearanceDepartment),
  message: z.string().min(1, 'Rejection message is required'),
});

export class ClearanceController extends BaseController<any, any, any, any> {
  modelName = 'Clearance';
  private clearanceService: ClearanceService;

  constructor() {
    super(new ClearanceService());
    this.clearanceService = new ClearanceService();
  }

  initiateClearance = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      if (req.user.role !== 'STUDENT') {
        ApiResponseHandler.forbidden(res, 'Only students can initiate clearance');
        return;
      }

      const clearance = await this.clearanceService.initiateClearance(req.user.userId);
      ApiResponseHandler.created(res, clearance, 'Clearance initiated successfully');
    } catch (error: any) {
      if (error.message?.includes('already initiated')) {
        ApiResponseHandler.conflict(res, error.message);
        return;
      }
      next(error);
    }
  };

  getMyClearance = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      if (req.user.role !== 'STUDENT') {
        ApiResponseHandler.forbidden(res, 'Only students can view their clearance');
        return;
      }

      const clearance = await this.clearanceService.findByStudentId(req.user.userId);
      if (!clearance) {
        ApiResponseHandler.notFound(res, 'Clearance not found');
        return;
      }

      ApiResponseHandler.success(res, clearance, 'Clearance retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  approveDepartment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const validatedData = approveDepartmentSchema.parse(req.body);

      const roleDepartmentMap: Record<string, ClearanceDepartment> = {
        HOD: ClearanceDepartment.DEPARTMENT,
        DEAN: ClearanceDepartment.ACADEMIC,
        STUDENT_AFFAIRS: ClearanceDepartment.STUDENT_AFFAIRS,
        ACCOUNTS: ClearanceDepartment.ACCOUNTS,
      };

      const allowedDepartment = roleDepartmentMap[req.user.role];
      if (!allowedDepartment || allowedDepartment !== validatedData.department) {
        ApiResponseHandler.forbidden(res, 'You do not have permission to approve this department');
        return;
      }

      const clearance = await this.clearanceService.approveDepartment(
        id,
        validatedData.department,
        req.user.userId,
        validatedData.message
      );

      ApiResponseHandler.success(res, clearance, 'Department approved successfully');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        ApiResponseHandler.badRequest(res, error.errors[0].message);
        return;
      }
      next(error);
    }
  };

  rejectDepartment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ApiResponseHandler.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const validatedData = rejectDepartmentSchema.parse(req.body);

      const roleDepartmentMap: Record<string, ClearanceDepartment> = {
        HOD: ClearanceDepartment.DEPARTMENT,
        DEAN: ClearanceDepartment.ACADEMIC,
        STUDENT_AFFAIRS: ClearanceDepartment.STUDENT_AFFAIRS,
        ACCOUNTS: ClearanceDepartment.ACCOUNTS,
      };

      const allowedDepartment = roleDepartmentMap[req.user.role];
      if (!allowedDepartment || allowedDepartment !== validatedData.department) {
        ApiResponseHandler.forbidden(res, 'You do not have permission to reject this department');
        return;
      }

      const clearance = await this.clearanceService.rejectDepartment(
        id,
        validatedData.department,
        req.user.userId,
        validatedData.message
      );

      ApiResponseHandler.success(res, clearance, 'Department rejected');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        ApiResponseHandler.badRequest(res, error.errors[0].message);
        return;
      }
      next(error);
    }
  };
}

