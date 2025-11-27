"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Users, CheckCircle, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { useFeatureFlags, hasFeature } from "@/hooks/use-feature-flags"
import type { FeaturePermission } from "@/lib/permissions"

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  feature?: FeaturePermission | FeaturePermission[]
  mode?: "any" | "all"
}

const navItems: Record<string, NavItem[]> = {
  student: [
    { label: "Dashboard", href: "/student", icon: <LayoutDashboard className="w-4 h-4" />, feature: "fyp:view_own_fyp" },
    { label: "FYP Idea", href: "/student/fyp/idea", icon: <FileText className="w-4 h-4" />, feature: "fyp:submit_idea" },
    { label: "Supervisor", href: "/student/fyp/supervisor", icon: <Users className="w-4 h-4" />, feature: "fyp:select_supervisor" },
    { label: "Proposal", href: "/student/fyp/proposal", icon: <FileText className="w-4 h-4" />, feature: "fyp:upload_proposal" },
    { label: "SRS Document", href: "/student/fyp/srs", icon: <FileText className="w-4 h-4" />, feature: "fyp:upload_srs" },
    {
      label: "Degree Clearance",
      href: "/student/clearance",
      icon: <CheckCircle className="w-4 h-4" />,
      feature: ["clearance:view_own_clearance", "clearance:view_multi_department_progress"],
      mode: "any",
    },
  ],
  supervisor: [
    {
      label: "Dashboard",
      href: "/supervisor",
      icon: <LayoutDashboard className="w-4 h-4" />,
      feature: "fyp:view_assigned_fyps",
    },
    {
      label: "My Students",
      href: "/supervisor/students",
      icon: <Users className="w-4 h-4" />,
      feature: "fyp:view_assigned_fyps",
    },
    {
      label: "Evaluations",
      href: "/supervisor/evaluations",
      icon: <CheckCircle className="w-4 h-4" />,
      feature: ["fyp:approve_proposal_readiness", "fyp:approve_internal_stage"],
      mode: "any",
    },
  ],
  examiner: [
    {
      label: "Dashboard",
      href: "/examiner",
      icon: <LayoutDashboard className="w-4 h-4" />,
      feature: "evaluation:view_assigned_evaluations",
    },
    {
      label: "Assigned FYPs",
      href: "/examiner/fyps",
      icon: <FileText className="w-4 h-4" />,
      feature: "fyp:view_assigned_fyps",
    },
    {
      label: "Evaluations",
      href: "/examiner/evaluations",
      icon: <CheckCircle className="w-4 h-4" />,
      feature: ["evaluation:evaluate_proposal", "evaluation:evaluate_srs"],
      mode: "any",
    },
  ],
  hod: [
    {
      label: "Dashboard",
      href: "/hod",
      icon: <LayoutDashboard className="w-4 h-4" />,
      feature: "fyp:view_all_fyps",
    },
    {
      label: "Clearances",
      href: "/hod/clearances",
      icon: <CheckCircle className="w-4 h-4" />,
      feature: "clearance:view_all_clearances",
    },
    {
      label: "Students",
      href: "/hod/students",
      icon: <Users className="w-4 h-4" />,
      feature: "fyp:view_all_fyps",
    },
  ],
  dean: [
    {
      label: "Dashboard",
      href: "/dean",
      icon: <LayoutDashboard className="w-4 h-4" />,
      feature: "clearance:view_all_clearances",
    },
    {
      label: "Clearances",
      href: "/dean/clearances",
      icon: <CheckCircle className="w-4 h-4" />,
      feature: "clearance:view_all_clearances",
    },
  ],
  "student-affairs": [
    {
      label: "Dashboard",
      href: "/student-affairs",
      icon: <LayoutDashboard className="w-4 h-4" />,
      feature: "clearance:view_all_clearances",
    },
    {
      label: "Clearances",
      href: "/student-affairs/clearances",
      icon: <CheckCircle className="w-4 h-4" />,
      feature: "clearance:view_all_clearances",
    },
  ],
  accounts: [
    {
      label: "Dashboard",
      href: "/accounts",
      icon: <LayoutDashboard className="w-4 h-4" />,
      feature: "clearance:view_all_clearances",
    },
    {
      label: "Clearances",
      href: "/accounts/clearances",
      icon: <CheckCircle className="w-4 h-4" />,
      feature: "clearance:view_all_clearances",
    },
  ],
  admin: [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-4 h-4" />,
      feature: ["admin:view_analytics", "admin:manage_users"],
      mode: "any",
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: <Users className="w-4 h-4" />,
      feature: "admin:manage_users",
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings className="w-4 h-4" />,
      feature: "admin:configure_workflows",
    },
  ],
}

export function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const featureFlags = useFeatureFlags()

  if (!user || pathname === "/login") return null

  const items = (navItems[user.role] || []).filter((item) => {
    if (!item.feature) return true
    return hasFeature(featureFlags, item.feature, item.mode)
  })

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 shadow-xl z-30 transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 font-bold text-lg">
            <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">📚</span>
            <span>AcadFlow</span>
          </Link>

          {/* User Info */}
          <div className="mb-8 pb-6 border-b border-gray-700">
            <p className="text-xs text-gray-400 mb-1">Logged in as</p>
            <p className="font-semibold text-sm">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role.replace("-", " ")}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {items.length === 0 ? (
              <p className="text-xs text-gray-500">No modules available for your current permissions.</p>
            ) : (
              items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    pathname === item.href ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800",
                  )}
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))
            )}
          </nav>

          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950"
            onClick={() => {
              logout()
              window.location.href = "/login"
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
