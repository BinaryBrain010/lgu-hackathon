"use client"

import { DegreeClearanceRing } from "@/components/student/degree-clearance-ring"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ClearancePage() {
  const clearanceData = [
    {
      department: "Department",
      status: "approved",
      officer: "Dr. Sarah Johnson",
      remarks: "All requirements fulfilled",
      date: "Dec 1, 2024",
    },
    {
      department: "Academic",
      status: "approved",
      officer: "Prof. David Miller",
      remarks: "Academic records verified",
      date: "Dec 2, 2024",
    },
    {
      department: "Student Affairs",
      status: "in_review",
      officer: "Ms. Aisha Patel",
      remarks: "Under review",
      date: "Pending",
    },
    {
      department: "Accounts",
      status: "pending",
      officer: "Mr. James Wilson",
      remarks: "Pending financial clearance",
      date: "Pending",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Degree Clearance Portal</h1>
        <p className="text-gray-600">Track your clearance status across all departments</p>
      </div>

      {/* Clearance Ring */}
      <DegreeClearanceRing
        clearanceStatus={{
          department: "approved",
          academic: "approved",
          student_affairs: "in_review",
          accounts: "pending",
        }}
      />

      {/* Detailed Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Clearance Status Details</h3>
        <div className="space-y-4">
          {clearanceData.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.department}</h4>
                <p className="text-sm text-gray-600 mt-1">Officer: {item.officer}</p>
                <p className="text-sm text-gray-600">Remarks: {item.remarks}</p>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    item.status === "approved" ? "default" : item.status === "in_review" ? "secondary" : "outline"
                  }
                >
                  {item.status}
                </Badge>
                <p className="text-xs text-gray-500 mt-2">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
