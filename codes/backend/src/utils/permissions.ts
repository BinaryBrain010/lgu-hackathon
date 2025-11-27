import { Role } from '@prisma/client';

export interface Permission {
  resource: string;
  actions: string[];
}

export type RolePermissions = {
  [key in Role]: Permission[];
};

/**
 * Defines permissions for each role based on their responsibilities
 */
export const ROLE_PERMISSIONS: RolePermissions = {
  [Role.STUDENT]: [
    {
      resource: 'fyp',
      actions: [
        'submit_idea',
        'select_supervisor',
        'upload_proposal',
        'upload_srs',
        'upload_final_documentation',
        'track_progress',
        'view_own_fyp',
      ],
    },
    {
      resource: 'clearance',
      actions: [
        'submit_request',
        'view_own_clearance',
        'view_multi_department_progress',
      ],
    },
    {
      resource: 'notifications',
      actions: ['view', 'mark_read'],
    },
  ],

  [Role.SUPERVISOR]: [
    {
      resource: 'fyp',
      actions: [
        'approve_reject_idea',
        'accept_reject_supervisor_selection',
        'upload_plagiarism_report',
        'upload_ai_similarity_report',
        'approve_proposal_readiness',
        'approve_srs',
        'approve_internal_stage',
        'forward_to_next_stage',
        'view_assigned_fyps',
      ],
    },
    {
      resource: 'notifications',
      actions: ['view', 'mark_read'],
    },
  ],

  [Role.EXAMINER]: [
    {
      resource: 'evaluation',
      actions: [
        'evaluate_proposal',
        'evaluate_srs',
        'conduct_evaluation',
        'enter_marks',
        'enter_feedback',
        'view_assigned_evaluations',
      ],
    },
    {
      resource: 'fyp',
      actions: ['view_assigned_fyps'],
    },
    {
      resource: 'notifications',
      actions: ['view', 'mark_read'],
    },
  ],

  [Role.HOD]: [
    {
      resource: 'fyp',
      actions: [
        'verify_supervisor_assignment',
        'approve_fyp_enrollment',
        'view_all_fyps',
      ],
    },
    {
      resource: 'clearance',
      actions: [
        'approve_department_clearance',
        'reject_department_clearance',
        'view_all_clearances',
      ],
    },
    {
      resource: 'notifications',
      actions: ['view', 'mark_read'],
    },
  ],

  [Role.DEAN]: [
    {
      resource: 'clearance',
      actions: [
        'approve_academic_clearance',
        'confirm_academic_eligibility',
        'view_all_clearances',
      ],
    },
    {
      resource: 'fyp',
      actions: ['view_all_fyps'],
    },
    {
      resource: 'notifications',
      actions: ['view', 'mark_read'],
    },
  ],

  [Role.STUDENT_AFFAIRS]: [
    {
      resource: 'clearance',
      actions: [
        'approve_hostel_clearance',
        'approve_library_clearance',
        'approve_lab_clearance',
        'validate_activity_records',
        'view_all_clearances',
      ],
    },
    {
      resource: 'notifications',
      actions: ['view', 'mark_read'],
    },
  ],

  [Role.ACCOUNTS]: [
    {
      resource: 'clearance',
      actions: [
        'check_dues',
        'approve_financial_clearance',
        'view_all_clearances',
      ],
    },
    {
      resource: 'notifications',
      actions: ['view', 'mark_read'],
    },
  ],

  [Role.ADMIN]: [
    {
      resource: 'admin',
      actions: [
        'manage_users',
        'manage_permissions',
        'configure_workflows',
        'ensure_security',
        'view_analytics',
      ],
    },
    {
      resource: 'fyp',
      actions: ['view_all_fyps', 'manage_stages'],
    },
    {
      resource: 'clearance',
      actions: ['view_all_clearances', 'manage_clearances'],
    },
    {
      resource: 'notifications',
      actions: ['view', 'mark_read', 'manage'],
    },
  ],
};

/**
 * Get permissions for a specific role
 */
export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(
  role: Role,
  resource: string,
  action: string
): boolean {
  const permissions = getPermissionsForRole(role);
  const resourcePermission = permissions.find((p) => p.resource === resource);
  
  if (!resourcePermission) {
    return false;
  }

  return resourcePermission.actions.includes(action);
}

/**
 * Get a flattened list of all permissions for a role (format: resource:action)
 */
export function getFlattenedPermissions(role: Role): string[] {
  const permissions = getPermissionsForRole(role);
  const flattened: string[] = [];

  permissions.forEach((permission) => {
    permission.actions.forEach((action) => {
      flattened.push(`${permission.resource}:${action}`);
    });
  });

  return flattened;
}

