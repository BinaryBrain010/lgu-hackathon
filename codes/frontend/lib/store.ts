import { create } from "zustand"
import { FEATURE_COOKIE_KEY, getDefaultPermissionsForRole } from "./permissions"

export type UserRole = "student" | "supervisor" | "examiner" | "hod" | "dean" | "student-affairs" | "accounts" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  avatar?: string
}

interface AuthStore {
  user: User | null
  login: (role: UserRole) => void
  logout: () => void
}

const mockUsers: Record<UserRole, User> = {
  student: {
    id: "STU001",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@university.edu",
    role: "student",
    department: "Computer Science",
    avatar: "AH",
  },
  supervisor: {
    id: "SUP001",
    name: "Dr. Fatima Khan",
    email: "fatima.khan@university.edu",
    role: "supervisor",
    department: "Computer Science",
    avatar: "FK",
  },
  examiner: {
    id: "EXM001",
    name: "Prof. Mohammed Ali",
    email: "mohammed.ali@university.edu",
    role: "examiner",
    department: "Computer Science",
    avatar: "MA",
  },
  hod: {
    id: "HOD001",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "hod",
    department: "Computer Science",
    avatar: "SJ",
  },
  dean: {
    id: "DEAN001",
    name: "Prof. David Miller",
    email: "david.miller@university.edu",
    role: "dean",
    department: "Academic Affairs",
    avatar: "DM",
  },
  "student-affairs": {
    id: "SA001",
    name: "Ms. Aisha Patel",
    email: "aisha.patel@university.edu",
    role: "student-affairs",
    department: "Student Affairs",
    avatar: "AP",
  },
  accounts: {
    id: "ACC001",
    name: "Mr. James Wilson",
    email: "james.wilson@university.edu",
    role: "accounts",
    department: "Accounts Office",
    avatar: "JW",
  },
  admin: {
    id: "ADM001",
    name: "Ms. Rachel Green",
    email: "rachel.green@university.edu",
    role: "admin",
    department: "IT Administration",
    avatar: "RG",
  },
}

function setCookie(name: string, value: string, maxAgeSeconds = 60 * 60 * 24) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}`
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; path=/; max-age=0`
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: (role: UserRole) => {
    const user = mockUsers[role]
    set({ user })
    const permissions = getDefaultPermissionsForRole(role)
    setCookie("acadflow_user", JSON.stringify(user))
    setCookie(FEATURE_COOKIE_KEY, JSON.stringify(permissions))
  },
  logout: () => {
    set({ user: null })
    clearCookie("acadflow_user")
    clearCookie("acadflow_token")
    clearCookie(FEATURE_COOKIE_KEY)
  },
}))
