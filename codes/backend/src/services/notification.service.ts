import { Notification, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { BaseService } from '../base/BaseService';
import { FilterParams } from '../types';

type NotificationCreateInput = Prisma.NotificationCreateInput;
type NotificationUpdateInput = Prisma.NotificationUpdateInput;
type NotificationWhereInput = Prisma.NotificationWhereInput;

export class NotificationService extends BaseService<
  Notification,
  NotificationCreateInput,
  NotificationUpdateInput,
  NotificationWhereInput
> {
  protected model = prisma.notification;

  async findByUserId(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    const where: NotificationWhereInput = {
      userId,
      ...(unreadOnly && { read: false }),
    };

    return await this.model.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        fyp: true,
      },
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.findOne(notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found or unauthorized');
    }

    return await this.update(notificationId, { read: true });
  }

  async markAllAsRead(userId: string): Promise<{ count: number }> {
    return await this.model.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.model.count({
      where: { userId, read: false },
    });
  }

  protected buildWhereClause(params: FilterParams): NotificationWhereInput {
    const where: NotificationWhereInput = {};

    if (params.userId) {
      where.userId = params.userId as string;
    }

    if (params.read !== undefined) {
      where.read = params.read === 'true' || params.read === true;
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { message: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }
}

