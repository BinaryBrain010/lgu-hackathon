"use client"

import { StudentList } from "@/components/supervisor/student-list"
import { Card } from "@/components/ui/card"

export default function StudentManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Students</h1>
        <p className="text-gray-600">Manage and review your assigned FYP students</p>
      </div>

      <Card className="p-6">
        <StudentList />
      </Card>
    </div>
  )
}
