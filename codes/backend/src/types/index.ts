import { 
  Role, 
  FYPStage, 
  DocumentType, 
  EvaluationType, 
  ClearanceStatus,
  ClearanceDepartment 
} from '@prisma/client';

// Re-export Prisma enums
export {
  Role,
  FYPStage,
  DocumentType,
  EvaluationType,
  ClearanceStatus,
  ClearanceDepartment,
};

// Custom types
export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterParams {
  search?: string;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface FYPStageTransition {
  from: FYPStage;
  to: FYPStage;
  allowed: boolean;
}

