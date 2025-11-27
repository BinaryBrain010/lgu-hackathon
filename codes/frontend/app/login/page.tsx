"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, type UserRole } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GraduationCap, Users, FileCheck, Settings } from "lucide-react"

const roles: Array<{ role: UserRole; label: string; icon: React.ReactNode; description: string }> = [
  { role: "student", label: "Student", icon: <GraduationCap className="w-5 h-5" />, description: "View FYP progress" },
  { role: "supervisor", label: "Supervisor", icon: <Users className="w-5 h-5" />, description: "Manage students" },
  { role: "examiner", label: "Examiner", icon: <FileCheck className="w-5 h-5" />, description: "Evaluate FYPs" },
  { role: "hod", label: "HOD", icon: <Settings className="w-5 h-5" />, description: "Department admin" },
  { role: "dean", label: "Dean", icon: <Settings className="w-5 h-5" />, description: "Academic office" },
  {
    role: "student-affairs",
    label: "Student Affairs",
    icon: <Users className="w-5 h-5" />,
    description: "Student services",
  },
  { role: "accounts", label: "Accounts", icon: <FileCheck className="w-5 h-5" />, description: "Finance clearance" },
  { role: "admin", label: "Admin", icon: <Settings className="w-5 h-5" />, description: "System admin" },
]

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null)

  const handleLogin = (role: UserRole) => {
    login(role)
    // Route based on role
    const roleRoutes: Record<UserRole, string> = {
      student: "/student",
      supervisor: "/supervisor",
      examiner: "/examiner",
      hod: "/hod",
      dean: "/dean",
      "student-affairs": "/student-affairs",
      accounts: "/accounts",
      admin: "/admin",
    }
    router.push(roleRoutes[role])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">AcadFlow</h1>
          </div>
          <p className="text-gray-600">FYP & Degree Workflow Automation Portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map(({ role, label, icon, description }) => (
            <Card
              key={role}
              className={`p-6 cursor-pointer transition-all duration-300 ${
                hoveredRole === role ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
              }`}
              onMouseEnter={() => setHoveredRole(role)}
              onMouseLeave={() => setHoveredRole(null)}
            >
              <div className="flex flex-col items-center gap-3 h-full">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">{icon}</div>
                <h3 className="font-semibold text-gray-900 text-center">{label}</h3>
                <p className="text-xs text-gray-600 text-center">{description}</p>
                <Button
                  className="mt-auto w-full"
                  onClick={() => handleLogin(role)}
                  variant={hoveredRole === role ? "default" : "outline"}
                >
                  Login
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Demo Information</h3>
          <p className="text-sm text-gray-600">
            Select any role above to login as that user. This is a mock application demonstrating the FYP & Degree
            Workflow system with realistic data for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  )
}
