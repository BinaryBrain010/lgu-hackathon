import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { UserService } from '../../user/service/user.service';
import { FYPService } from '../../fyp/service/fyp.service';
import { ClearanceService } from '../../clearance/service/clearance.service';
import { ApiResponseHandler } from '../../../utils/response';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import prisma from '../../../config/database';

export class AdminController {
  private userService: UserService;
  private fypService: FYPService;
  private clearanceService: ClearanceService;

  constructor() {
    this.userService = new UserService();
    this.fypService = new FYPService();
    this.clearanceService = new ClearanceService();
  }

  getAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [totalUsers, totalStudents, totalSupervisors, totalFYPs, fypsByStage, totalClearances, clearancesByStatus] = await Promise.all([
        this.userService.count(),
        this.userService.count({ role: Role.STUDENT } as any),
        this.userService.count({ role: Role.SUPERVISOR } as any),
        this.fypService.count(),
        this.getFYPStageDistribution(),
        this.clearanceService.count(),
        this.getClearanceStatusDistribution(),
      ]);

      ApiResponseHandler.success(
        res,
        {
          users: { total: totalUsers, students: totalStudents, supervisors: totalSupervisors },
          fyps: { total: totalFYPs, byStage: fypsByStage },
          clearances: { total: totalClearances, byStatus: clearancesByStatus },
        },
        'Analytics retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        role: req.query.role as Role | undefined,
        search: req.query.search as string | undefined,
      };

      const result = await this.userService.findAll(params);
      ApiResponseHandler.success(res, result, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.create(req.body);
      ApiResponseHandler.created(res, user, 'User created successfully');
    } catch (error) {
      next(error);
    }
  };

  private async getFYPStageDistribution(): Promise<Record<string, number>> {
    const stages = await prisma.fYP.groupBy({ by: ['stage'], _count: { stage: true } });
    return stages.reduce((acc, stage) => {
      acc[stage.stage] = stage._count.stage;
      return acc;
    }, {} as Record<string, number>);
  }

  private async getClearanceStatusDistribution(): Promise<Record<string, number>> {
    const statuses = await prisma.degreeClearance.groupBy({ by: ['status'], _count: { status: true } });
    return statuses.reduce((acc, status) => {
      acc[status.status] = status._count.status;
      return acc;
    }, {} as Record<string, number>);
  }
}

