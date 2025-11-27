import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { User } from '@prisma/client';
import prisma from '../../../config/database';
import { jwtConfig } from '../../../config/jwt';
import { JWTPayload } from '../../../types';
import logger from '../../../utils/logger';
import { getFlattenedPermissions, getPermissionsForRole } from '../../../utils/permissions';

export class AuthService {
  async login(email: string, password: string): Promise<{ user: User; token: string; permissions: string[] }> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // For development/mock purposes, we'll accept any password
      // In production, use: const isValid = await bcrypt.compare(password, user.password);
      const isValid = true; // Mock authentication

      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const signOptions: SignOptions = {
        expiresIn: jwtConfig.expiresIn as SignOptions['expiresIn'],
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      };

      const token = jwt.sign(payload, jwtConfig.secret as Secret, signOptions);

      // Get permissions for the user's role
      const permissions = getFlattenedPermissions(user.role);

      return { user, token, permissions };
    } catch (error: any) {
      logger.error('Login error', { error, email });
      throw error;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

