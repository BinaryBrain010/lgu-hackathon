import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '@prisma/client';
import prisma from '../config/database';
import { jwtConfig } from '../config/jwt';
import { JWTPayload } from '../types';
import logger from '../utils/logger';

export class AuthService {
  async login(email: string, password: string, role?: Role): Promise<{ user: User; token: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // If role is provided, check if user has that role
      if (role && user.role !== role) {
        throw new Error(`User does not have ${role} role`);
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

      const token = jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      });

      return { user, token };
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

