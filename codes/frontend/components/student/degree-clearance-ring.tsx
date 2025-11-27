"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, X } from "lucide-react"

interface ClearanceRingProps {
  clearanceStatus: Record<string, string>
}

const departments = [
  { key: "department", label: "Department" },
  { key: "academic", label: "Academic" },
  { key: "student_affairs", label: "Student Affairs" },
  { key: "accounts", label: "Accounts" },
]

const statusConfig = {
  approved: { color: "bg-green-100 text-green-700", icon: CheckCircle2, label: "Approved" },
  pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Pending" },
  in_review: { color: "bg-blue-100 text-blue-700", icon: Clock, label: "In Review" },
  rejected: { color: "bg-red-100 text-red-700", icon: X, label: "Rejected" },
}

export function DegreeClearanceRing({ clearanceStatus }: ClearanceRingProps) {
  const completed = Object.values(clearanceStatus).filter((s) => s === "approved").length
  const total = departments.length
  const percentage = Math.round((completed / total) * 100)

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Degree Clearance Status</h3>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Circle Progress */}
        <div className="relative w-40 h-40 flex-shrink-0">
          <svg className="w-full h-full" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeDasharray={`${(percentage / 100) * 440} 440`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.5s ease" }}
              transform="rotate(-90 80 80)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{percentage}%</p>
              <p className="text-xs text-gray-600">Complete</p>
            </div>
          </div>
        </div>

        {/* Department Status List */}
        <div className="space-y-3 flex-1">
          {departments.map(({ key, label }) => {
            const status = clearanceStatus[key]
            const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
            const Icon = config.icon

            return (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <Badge className={config.color}>{config.label}</Badge>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
