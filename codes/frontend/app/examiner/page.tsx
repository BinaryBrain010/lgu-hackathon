"use client"

import { supervisorStudents } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, Clock } from "lucide-react"

export default function ExaminerDashboard() {
  const assignedFYPs = supervisorStudents.length
  const evaluated = Math.floor(assignedFYPs / 2)
  const pending = assignedFYPs - evaluated

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Assigned FYPs</p>
              <p className="text-2xl font-bold text-gray-900">{assignedFYPs}</p>
            </div>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Evaluated</p>
              <p className="text-2xl font-bold text-gray-900">{evaluated}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
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
              <p className="text-xs text-gray-600 mb-1">Completion</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round((evaluated / assignedFYPs) * 100)}%</p>
            </div>
            <CheckCircle className="w-5 h-5 text-indigo-500" />
          </div>
        </Card>
      </div>

      {/* Assigned FYPs */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Assigned FYPs for Evaluation</h3>
        <div className="space-y-3">
          {supervisorStudents.map((student, idx) => (
            <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{student.name}</h4>
                <p className="text-sm text-gray-600">{student.fyp.title}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {student.fyp.domain}
                  </Badge>
                  <Badge className={idx < evaluated ? "bg-green-500" : "bg-yellow-500"}>
                    {idx < evaluated ? "Evaluated" : "Pending"}
                  </Badge>
                </div>
              </div>
              <Button size="sm" variant={idx < evaluated ? "outline" : "default"}>
                {idx < evaluated ? "View Evaluation" : "Evaluate"}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
