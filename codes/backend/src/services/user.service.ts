import { User, Prisma, Role } from '@prisma/client';
import prisma from '../config/database';
import { BaseService } from '../base/BaseService';
import { FilterParams } from '../types';

type UserCreateInput = Prisma.UserCreateInput;
type UserUpdateInput = Prisma.UserUpdateInput;
type UserWhereInput = Prisma.UserWhereInput;

export class UserService extends BaseService<User, UserCreateInput, UserUpdateInput, UserWhereInput> {
  protected model = prisma.user;

  async findByEmail(email: string): Promise<User | null> {
    return this.findBy({ email } as UserWhereInput);
  }

  async findByStudentId(studentId: string): Promise<User | null> {
    return this.findBy({ studentId } as UserWhereInput);
  }

  async findByRole(role: Role, params: FilterParams = {}): Promise<User[]> {
    try {
      const where: UserWhereInput = {
        role,
        ...(params.search && {
          OR: [
            { firstName: { contains: params.search, mode: 'insensitive' } },
            { lastName: { contains: params.search, mode: 'insensitive' } },
            { email: { contains: params.search, mode: 'insensitive' } },
          ],
        }),
      };

      return await this.model.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw error;
    }
  }

  protected buildWhereClause(params: FilterParams): UserWhereInput {
    const where: UserWhereInput = {};

    if (params.search) {
      where.OR = [
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { studentId: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.role) {
      where.role = params.role as Role;
    }

    if (params.department) {
      where.department = { contains: params.department as string, mode: 'insensitive' };
    }

    return where;
  }
}

