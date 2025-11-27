"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Users, CheckCircle, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

const navItems: Record<string, Array<{ label: string; href: string; icon: React.ReactNode }>> = {
  student: [
    { label: "Dashboard", href: "/student", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "FYP Idea", href: "/student/fyp/idea", icon: <FileText className="w-4 h-4" /> },
    { label: "Supervisor", href: "/student/fyp/supervisor", icon: <Users className="w-4 h-4" /> },
    { label: "Proposal", href: "/student/fyp/proposal", icon: <FileText className="w-4 h-4" /> },
    { label: "SRS Document", href: "/student/fyp/srs", icon: <FileText className="w-4 h-4" /> },
    { label: "Degree Clearance", href: "/student/clearance", icon: <CheckCircle className="w-4 h-4" /> },
  ],
  supervisor: [
    { label: "Dashboard", href: "/supervisor", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "My Students", href: "/supervisor/students", icon: <Users className="w-4 h-4" /> },
    { label: "Evaluations", href: "/supervisor/evaluations", icon: <CheckCircle className="w-4 h-4" /> },
  ],
  examiner: [
    { label: "Dashboard", href: "/examiner", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Assigned FYPs", href: "/examiner/fyps", icon: <FileText className="w-4 h-4" /> },
    { label: "Evaluations", href: "/examiner/evaluations", icon: <CheckCircle className="w-4 h-4" /> },
  ],
  hod: [
    { label: "Dashboard", href: "/hod", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Clearances", href: "/hod/clearances", icon: <CheckCircle className="w-4 h-4" /> },
    { label: "Students", href: "/hod/students", icon: <Users className="w-4 h-4" /> },
  ],
  dean: [
    { label: "Dashboard", href: "/dean", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Clearances", href: "/dean/clearances", icon: <CheckCircle className="w-4 h-4" /> },
  ],
  "student-affairs": [
    { label: "Dashboard", href: "/student-affairs", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Clearances", href: "/student-affairs/clearances", icon: <CheckCircle className="w-4 h-4" /> },
  ],
  accounts: [
    { label: "Dashboard", href: "/accounts", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Clearances", href: "/accounts/clearances", icon: <CheckCircle className="w-4 h-4" /> },
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Users", href: "/admin/users", icon: <Users className="w-4 h-4" /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ],
}

export function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (!user || pathname === "/login") return null

  const items = navItems[user.role] || []

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
            {items.map((item) => (
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
            ))}
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
