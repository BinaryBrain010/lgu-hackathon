import { DegreeClearance, ClearanceStatus, ClearanceDepartment, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { BaseService } from '../base/BaseService';
import { FilterParams } from '../types';
import logger from '../utils/logger';

type ClearanceCreateInput = Prisma.DegreeClearanceCreateInput;
type ClearanceUpdateInput = Prisma.DegreeClearanceUpdateInput;
type ClearanceWhereInput = Prisma.DegreeClearanceWhereInput;

export class ClearanceService extends BaseService<
  DegreeClearance,
  ClearanceCreateInput,
  ClearanceUpdateInput,
  ClearanceWhereInput
> {
  protected model = prisma.degreeClearance;

  async findByStudentId(studentId: string): Promise<DegreeClearance | null> {
    return await this.model.findUnique({
      where: { studentId },
      include: {
        student: true,
        remarks: {
          include: {
            officer: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async initiateClearance(studentId: string): Promise<DegreeClearance> {
    try {
      // Check if clearance already exists
      const existing = await this.findByStudentId(studentId);
      if (existing) {
        throw new Error('Clearance already initiated');
      }

      const clearance = await this.create({
        studentId,
        status: ClearanceStatus.PENDING,
        departmentStatus: ClearanceStatus.PENDING,
        academicStatus: ClearanceStatus.PENDING,
        affairsStatus: ClearanceStatus.PENDING,
        accountsStatus: ClearanceStatus.PENDING,
      } as ClearanceCreateInput);

      // Create notification
      await prisma.notification.create({
        data: {
          userId: studentId,
          title: 'Degree Clearance Initiated',
          message: 'Your degree clearance request has been initiated. Please wait for approvals.',
        },
      });

      return clearance;
    } catch (error) {
      logger.error('Error initiating clearance', { error, studentId });
      throw error;
    }
  }

  async approveDepartment(
    clearanceId: string,
    department: ClearanceDepartment,
    officerId: string,
    message?: string
  ): Promise<DegreeClearance> {
    try {
      const clearance = await this.findOne(clearanceId);
      if (!clearance) {
        throw new Error('Clearance not found');
      }

      const updateData: any = {};
      
      if (department === ClearanceDepartment.DEPARTMENT) {
        updateData.departmentStatus = ClearanceStatus.APPROVED;
      } else if (department === ClearanceDepartment.ACADEMIC) {
        updateData.academicStatus = ClearanceStatus.APPROVED;
      } else if (department === ClearanceDepartment.STUDENT_AFFAIRS) {
        updateData.affairsStatus = ClearanceStatus.APPROVED;
      } else if (department === ClearanceDepartment.ACCOUNTS) {
        updateData.accountsStatus = ClearanceStatus.APPROVED;
      }

      // Create remark if message provided
      if (message) {
        await prisma.clearanceRemark.create({
          data: {
            clearanceId,
            department,
            message,
            officerId,
          },
        });
      }

      const updated = await this.update(clearanceId, updateData);

      // Check if all departments are approved
      await this.updateOverallStatus(clearanceId);

      // Create notification
      await prisma.notification.create({
        data: {
          userId: clearance.studentId,
          title: 'Clearance Department Approved',
          message: `${department} has approved your clearance request.`,
        },
      });

      return updated;
    } catch (error) {
      logger.error('Error approving department', { error, clearanceId, department });
      throw error;
    }
  }

  async rejectDepartment(
    clearanceId: string,
    department: ClearanceDepartment,
    officerId: string,
    message: string
  ): Promise<DegreeClearance> {
    try {
      const clearance = await this.findOne(clearanceId);
      if (!clearance) {
        throw new Error('Clearance not found');
      }

      const updateData: any = { status: ClearanceStatus.REJECTED };
      
      if (department === ClearanceDepartment.DEPARTMENT) {
        updateData.departmentStatus = ClearanceStatus.REJECTED;
      } else if (department === ClearanceDepartment.ACADEMIC) {
        updateData.academicStatus = ClearanceStatus.REJECTED;
      } else if (department === ClearanceDepartment.STUDENT_AFFAIRS) {
        updateData.affairsStatus = ClearanceStatus.REJECTED;
      } else if (department === ClearanceDepartment.ACCOUNTS) {
        updateData.accountsStatus = ClearanceStatus.REJECTED;
      }

      // Create remark
      await prisma.clearanceRemark.create({
        data: {
          clearanceId,
          department,
          message,
          officerId,
        },
      });

      const updated = await this.update(clearanceId, updateData);

      // Create notification
      await prisma.notification.create({
        data: {
          userId: clearance.studentId,
          title: 'Clearance Department Rejected',
          message: `${department} has rejected your clearance request: ${message}`,
        },
      });

      return updated;
    } catch (error) {
      logger.error('Error rejecting department', { error, clearanceId, department });
      throw error;
    }
  }

  private async updateOverallStatus(clearanceId: string): Promise<void> {
    const clearance = await this.model.findUnique({
      where: { id: clearanceId },
    });

    if (!clearance) return;

    const allApproved =
      clearance.departmentStatus === ClearanceStatus.APPROVED &&
      clearance.academicStatus === ClearanceStatus.APPROVED &&
      clearance.affairsStatus === ClearanceStatus.APPROVED &&
      clearance.accountsStatus === ClearanceStatus.APPROVED;

    if (allApproved) {
      await this.update(clearanceId, {
        status: ClearanceStatus.APPROVED,
        completedAt: new Date(),
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: clearance.studentId,
          title: 'Degree Clearance Approved',
          message: 'Congratulations! Your degree clearance has been fully approved.',
        },
      });
    } else {
      await this.update(clearanceId, {
        status: ClearanceStatus.IN_REVIEW,
      });
    }
  }

  protected buildWhereClause(params: FilterParams): ClearanceWhereInput {
    const where: ClearanceWhereInput = {};

    if (params.studentId) {
      where.studentId = params.studentId as string;
    }

    if (params.status) {
      where.status = params.status as ClearanceStatus;
    }

    return where;
  }
}

