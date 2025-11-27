export const FEATURE_COOKIE_KEY = "acadflow_permissions"

export const ALL_PERMISSIONS = [
  "fyp:submit_idea",
  "fyp:select_supervisor",
  "fyp:upload_proposal",
  "fyp:upload_srs",
  "fyp:upload_final_documentation",
  "fyp:track_progress",
  "fyp:view_own_fyp",
  "clearance:submit_request",
  "clearance:view_own_clearance",
  "clearance:view_multi_department_progress",
  "notifications:view",
  "notifications:mark_read",
  "fyp:approve_reject_idea",
  "fyp:accept_reject_supervisor_selection",
  "fyp:upload_plagiarism_report",
  "fyp:upload_ai_similarity_report",
  "fyp:approve_proposal_readiness",
  "fyp:approve_srs",
  "fyp:approve_internal_stage",
  "fyp:forward_to_next_stage",
  "fyp:view_assigned_fyps",
  "evaluation:evaluate_proposal",
  "evaluation:evaluate_srs",
  "evaluation:conduct_evaluation",
  "evaluation:enter_marks",
  "evaluation:enter_feedback",
  "evaluation:view_assigned_evaluations",
  "fyp:verify_supervisor_assignment",
  "fyp:approve_fyp_enrollment",
  "fyp:view_all_fyps",
  "clearance:approve_department_clearance",
  "clearance:reject_department_clearance",
  "clearance:view_all_clearances",
  "clearance:approve_academic_clearance",
  "clearance:confirm_academic_eligibility",
  "clearance:approve_hostel_clearance",
  "clearance:approve_library_clearance",
  "clearance:approve_lab_clearance",
  "clearance:validate_activity_records",
  "clearance:check_dues",
  "clearance:approve_financial_clearance",
  "admin:manage_users",
  "admin:manage_permissions",
  "admin:configure_workflows",
  "admin:ensure_security",
  "admin:view_analytics",
  "fyp:manage_stages",
  "clearance:manage_clearances",
  "notifications:manage",
] as const

export type FeaturePermission = (typeof ALL_PERMISSIONS)[number]

const PERMISSION_SET = new Set<string>(ALL_PERMISSIONS as readonly string[])

export const ROLE_PERMISSIONS = {
  STUDENT: [
    "fyp:submit_idea",
    "fyp:select_supervisor",
    "fyp:upload_proposal",
    "fyp:upload_srs",
    "fyp:upload_final_documentation",
    "fyp:track_progress",
    "fyp:view_own_fyp",
    "clearance:submit_request",
    "clearance:view_own_clearance",
    "clearance:view_multi_department_progress",
    "notifications:view",
    "notifications:mark_read",
  ],
  SUPERVISOR: [
    "fyp:approve_reject_idea",
    "fyp:accept_reject_supervisor_selection",
    "fyp:upload_plagiarism_report",
    "fyp:upload_ai_similarity_report",
    "fyp:approve_proposal_readiness",
    "fyp:approve_srs",
    "fyp:approve_internal_stage",
    "fyp:forward_to_next_stage",
    "fyp:view_assigned_fyps",
    "notifications:view",
    "notifications:mark_read",
  ],
  EXAMINER: [
    "evaluation:evaluate_proposal",
    "evaluation:evaluate_srs",
    "evaluation:conduct_evaluation",
    "evaluation:enter_marks",
    "evaluation:enter_feedback",
    "evaluation:view_assigned_evaluations",
    "fyp:view_assigned_fyps",
    "notifications:view",
    "notifications:mark_read",
  ],
  HOD: [
    "fyp:verify_supervisor_assignment",
    "fyp:approve_fyp_enrollment",
    "fyp:view_all_fyps",
    "clearance:approve_department_clearance",
    "clearance:reject_department_clearance",
    "clearance:view_all_clearances",
    "notifications:view",
    "notifications:mark_read",
  ],
  DEAN: [
    "clearance:approve_academic_clearance",
    "clearance:confirm_academic_eligibility",
    "clearance:view_all_clearances",
    "fyp:view_all_fyps",
    "notifications:view",
    "notifications:mark_read",
  ],
  STUDENT_AFFAIRS: [
    "clearance:approve_hostel_clearance",
    "clearance:approve_library_clearance",
    "clearance:approve_lab_clearance",
    "clearance:validate_activity_records",
    "clearance:view_all_clearances",
    "notifications:view",
    "notifications:mark_read",
  ],
  ACCOUNTS: [
    "clearance:check_dues",
    "clearance:approve_financial_clearance",
    "clearance:view_all_clearances",
    "notifications:view",
    "notifications:mark_read",
  ],
  ADMIN: [
    "admin:manage_users",
    "admin:manage_permissions",
    "admin:configure_workflows",
    "admin:ensure_security",
    "admin:view_analytics",
    "fyp:view_all_fyps",
    "fyp:manage_stages",
    "clearance:view_all_clearances",
    "clearance:manage_clearances",
    "notifications:view",
    "notifications:mark_read",
    "notifications:manage",
  ],
} as const satisfies Record<string, FeaturePermission[]>

export type RoleKey = keyof typeof ROLE_PERMISSIONS

export function normalizeRoleKey(role?: string | null): RoleKey | undefined {
  if (!role) return undefined
  const normalized = role.replace(/-/g, "_").toUpperCase()
  return normalized in ROLE_PERMISSIONS ? (normalized as RoleKey) : undefined
}

export function getDefaultPermissionsForRole(role?: string | null): FeaturePermission[] {
  const key = normalizeRoleKey(role)
  if (!key) return []
  return ROLE_PERMISSIONS[key]
}

export function sanitizePermissions(perms?: string[] | null): FeaturePermission[] {
  if (!perms) return []
  return perms.filter((perm): perm is FeaturePermission => PERMISSION_SET.has(perm))
}

