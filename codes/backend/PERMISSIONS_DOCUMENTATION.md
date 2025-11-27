# Login Permissions Documentation

This document lists all permissions sent in the login response for each role. Permissions are returned as a flattened array in the format: `resource:action`.

---

## 📋 STUDENT Role

**Total Permissions: 10**

### FYP Permissions (7)
- `fyp:submit_idea`
- `fyp:select_supervisor`
- `fyp:upload_proposal`
- `fyp:upload_srs`
- `fyp:upload_final_documentation`
- `fyp:track_progress`
- `fyp:view_own_fyp`

### Clearance Permissions (3)
- `clearance:submit_request`
- `clearance:view_own_clearance`
- `clearance:view_multi_department_progress`

### Notification Permissions (2)
- `notifications:view`
- `notifications:mark_read`

---

## 👨‍🏫 SUPERVISOR Role

**Total Permissions: 11**

### FYP Permissions (9)
- `fyp:approve_reject_idea`
- `fyp:accept_reject_supervisor_selection`
- `fyp:upload_plagiarism_report`
- `fyp:upload_ai_similarity_report`
- `fyp:approve_proposal_readiness`
- `fyp:approve_srs`
- `fyp:approve_internal_stage`
- `fyp:forward_to_next_stage`
- `fyp:view_assigned_fyps`

### Notification Permissions (2)
- `notifications:view`
- `notifications:mark_read`

---

## 📝 EXAMINER Role (Internal/External)

**Total Permissions: 9**

### Evaluation Permissions (6)
- `evaluation:evaluate_proposal`
- `evaluation:evaluate_srs`
- `evaluation:conduct_evaluation`
- `evaluation:enter_marks`
- `evaluation:enter_feedback`
- `evaluation:view_assigned_evaluations`

### FYP Permissions (1)
- `fyp:view_assigned_fyps`

### Notification Permissions (2)
- `notifications:view`
- `notifications:mark_read`

---

## 🎓 HOD (Head of Department) Role

**Total Permissions: 8**

### FYP Permissions (3)
- `fyp:verify_supervisor_assignment`
- `fyp:approve_fyp_enrollment`
- `fyp:view_all_fyps`

### Clearance Permissions (3)
- `clearance:approve_department_clearance`
- `clearance:reject_department_clearance`
- `clearance:view_all_clearances`

### Notification Permissions (2)
- `notifications:view`
- `notifications:mark_read`

---

## 🏛️ DEAN / Academic Office Role

**Total Permissions: 6**

### Clearance Permissions (3)
- `clearance:approve_academic_clearance`
- `clearance:confirm_academic_eligibility`
- `clearance:view_all_clearances`

### FYP Permissions (1)
- `fyp:view_all_fyps`

### Notification Permissions (2)
- `notifications:view`
- `notifications:mark_read`

---

## 🏢 STUDENT_AFFAIRS Role

**Total Permissions: 7**

### Clearance Permissions (5)
- `clearance:approve_hostel_clearance`
- `clearance:approve_library_clearance`
- `clearance:approve_lab_clearance`
- `clearance:validate_activity_records`
- `clearance:view_all_clearances`

### Notification Permissions (2)
- `notifications:view`
- `notifications:mark_read`

---

## 💰 ACCOUNTS Role

**Total Permissions: 5**

### Clearance Permissions (3)
- `clearance:check_dues`
- `clearance:approve_financial_clearance`
- `clearance:view_all_clearances`

### Notification Permissions (2)
- `notifications:view`
- `notifications:mark_read`

---

## 🔧 ADMIN (System Admin) Role

**Total Permissions: 12**

### Admin Permissions (5)
- `admin:manage_users`
- `admin:manage_permissions`
- `admin:configure_workflows`
- `admin:ensure_security`
- `admin:view_analytics`

### FYP Permissions (2)
- `fyp:view_all_fyps`
- `fyp:manage_stages`

### Clearance Permissions (2)
- `clearance:view_all_clearances`
- `clearance:manage_clearances`

### Notification Permissions (3)
- `notifications:view`
- `notifications:mark_read`
- `notifications:manage`

---

## 📊 Permission Summary by Resource

### FYP Resource
- **STUDENT**: 7 permissions (submit, upload, track own FYP)
- **SUPERVISOR**: 9 permissions (approve, manage assigned FYPs)
- **EXAMINER**: 1 permission (view assigned FYPs)
- **HOD**: 3 permissions (verify, approve enrollment, view all)
- **DEAN**: 1 permission (view all)
- **ADMIN**: 2 permissions (view all, manage stages)

### Clearance Resource
- **STUDENT**: 3 permissions (submit, view own clearance)
- **HOD**: 3 permissions (approve/reject department clearance)
- **DEAN**: 3 permissions (approve academic clearance)
- **STUDENT_AFFAIRS**: 5 permissions (approve hostel/library/lab clearance)
- **ACCOUNTS**: 3 permissions (check dues, approve financial clearance)
- **ADMIN**: 2 permissions (view all, manage clearances)

### Evaluation Resource
- **EXAMINER**: 6 permissions (evaluate, enter marks/feedback)

### Admin Resource
- **ADMIN**: 5 permissions (manage users, permissions, workflows)

### Notifications Resource
- **All Roles**: View and mark read (ADMIN also has manage)

---

## 🔑 Login Response Format

When a user logs in, they receive:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "STUDENT"
    },
    "token": "jwt_token_here",
    "permissions": [
      "fyp:submit_idea",
      "fyp:select_supervisor",
      "clearance:submit_request",
      ...
    ]
  },
  "message": "Login successful"
}
```

The `permissions` array contains all flattened permissions in `resource:action` format for the user's role.

