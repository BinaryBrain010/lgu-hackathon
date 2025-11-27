"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { clearanceRequests } from "@/lib/mock-data"
import { CheckCircle, Clock, Users, TrendingUp } from "lucide-react"

export default function DeanDashboard() {
  const academicClearances = clearanceRequests.filter((c) => c.department === "academic")
  const pending = academicClearances.filter((c) => c.status === "pending").length
  const approved = academicClearances.filter((c) => c.status === "approved").length
  const inReview = academicClearances.filter((c) => c.status === "in_review").length

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{academicClearances.length}</p>
            </div>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pending}</p>
            </div>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">In Review</p>
              <p className="text-2xl font-bold text-gray-900">{inReview}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approved}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-col md:flex-row gap-2">
          <Button>Review Pending Clearances</Button>
          <Button variant="outline">Generate Report</Button>
          <Button variant="outline">Bulk Approve</Button>
        </div>
      </Card>
    </div>
  )
}
