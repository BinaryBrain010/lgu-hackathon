"use client"

import { useState } from "react"
import { DegreeClearanceRing } from "@/components/student/degree-clearance-ring"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const initialClearance = [
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

export default function ClearancePage() {
  const [clearanceData, setClearanceData] = useState(initialClearance)
  const [request, setRequest] = useState({
    hostel: "",
    library: "",
    lab: "",
    remarks: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setClearanceData((prev) =>
        prev.map((entry) =>
          entry.department === "Student Affairs"
            ? { ...entry, status: "in_review", remarks: "Submitted for verification", date: new Date().toLocaleDateString() }
            : entry.department === "Accounts"
              ? { ...entry, status: "pending", remarks: "Awaiting finance confirmation" }
              : entry
        )
      )
      setSubmitting(false)
    }, 900)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Degree Clearance Portal</h1>
        <p className="text-gray-600">Submit clearance requests and monitor approvals across all desks.</p>
      </div>

      <DegreeClearanceRing
        clearanceStatus={{
          department: clearanceData[0].status as "approved",
          academic: clearanceData[1].status as "approved",
          student_affairs: clearanceData[2].status as "approved" | "in_review" | "pending",
          accounts: clearanceData[3].status as "approved" | "pending",
        }}
      />

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Submit unified clearance request</h3>
        <form onSubmit={handleRequest} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {(["hostel", "library", "lab"] as const).map((field) => (
              <div key={field}>
                <label className="text-sm font-medium text-slate-700 capitalize">{field} assets returned?</label>
                <select
                  required
                  value={request[field]}
                  onChange={(e) => setRequest((prev) => ({ ...prev, [field]: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            ))}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Additional remarks</label>
            <textarea
              rows={3}
              value={request.remarks}
              onChange={(e) => setRequest((prev) => ({ ...prev, remarks: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Give context for pending items or attachments"
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Clearance Request"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Clearance status details</h3>
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
