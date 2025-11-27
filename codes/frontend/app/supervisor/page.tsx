"use client"

import { supervisorStudents } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StudentList } from "@/components/supervisor/student-list"
import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function SupervisorDashboard() {
  const totalStudents = supervisorStudents.length
  const pendingReviews = supervisorStudents.filter((s) => s.pendingActions.length > 0).length
  const completed = supervisorStudents.filter((s) => s.stage === 6).length

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{pendingReviews}</p>
            </div>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completed}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round((completed / totalStudents) * 100)}%</p>
            </div>
            <CheckCircle className="w-5 h-5 text-indigo-500" />
          </div>
        </Card>
      </div>

      {/* Students List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">My Students</h2>
            <StudentList />
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <AlertCircle className="w-4 h-4 mr-2" />
                Upload Plagiarism Report
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Submissions
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="w-4 h-4 mr-2" />
                Send Feedback
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
