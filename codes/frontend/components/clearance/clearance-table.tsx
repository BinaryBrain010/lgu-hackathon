"use client"

import { clearanceRequests } from "@/lib/mock-data"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ClearanceTableProps {
  role: string
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

const departmentLabels: Record<string, string> = {
  department: "Department",
  academic: "Academic",
  student_affairs: "Student Affairs",
  accounts: "Accounts",
}

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
  in_review: { color: "bg-blue-100 text-blue-800", icon: AlertCircle, label: "In Review" },
  approved: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Approved" },
  rejected: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Rejected" },
}

export function ClearanceTable({ role, onApprove, onReject }: ClearanceTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  // Filter based on role
  let filtered = clearanceRequests

  // If viewing from a specific department role, filter to that department
  const roleToDepart: Record<string, string> = {
    hod: "department",
    dean: "academic",
    "student-affairs": "student_affairs",
    accounts: "accounts",
  }

  if (roleToDepart[role]) {
    filtered = filtered.filter((r) => r.department === roleToDepart[role])
  }

  // Apply status filter
  if (filter !== "all") {
    filtered = filtered.filter((r) => r.status === filter)
  }

  // Apply search
  if (searchTerm) {
    filtered = filtered.filter(
      (r) =>
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by student name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in_review">In Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No clearance requests found</p>
          </Card>
        ) : (
          filtered.map((request) => {
            const statusCfg = statusConfig[request.status as keyof typeof statusConfig]
            const StatusIcon = statusCfg.icon

            return (
              <Card key={request.id} className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Student Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.studentName}</h3>
                        <p className="text-xs text-gray-600">ID: {request.studentId}</p>
                        <p className="text-xs text-gray-600 mt-1">Department: {departmentLabels[request.department]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status and Details */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge className={statusCfg.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusCfg.label}
                      </Badge>
                      <p className="text-xs text-gray-600 mt-2">Officer: {request.officer}</p>
                      <p className="text-xs text-gray-600">
                        {request.approvalDate
                          ? `Approved: ${request.approvalDate}`
                          : `Submitted: ${request.createdDate}`}
                      </p>
                    </div>

                    {/* Actions for reviewers */}
                    {(request.status === "pending" || request.status === "in_review") && (onApprove || onReject) ? (
                      <div className="flex gap-2">
                        {onApprove && (
                          <Button size="sm" variant="default" onClick={() => onApprove(request.id)}>
                            Approve
                          </Button>
                        )}
                        {onReject && (
                          <Button size="sm" variant="outline" onClick={() => onReject(request.id)}>
                            Reject
                          </Button>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Remarks */}
                {request.remarks && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Remarks:</span> {request.remarks}
                    </p>
                  </div>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
