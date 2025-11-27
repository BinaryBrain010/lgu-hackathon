"use client"

import { useState } from "react"
import { FYPProgress } from "@/components/student/fyp-progress"
import { DegreeClearanceRing } from "@/components/student/degree-clearance-ring"
import { QuickStats } from "@/components/student/quick-stats"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FeatureGate } from "@/components/access/feature-gate"
import { notifications, fypStages } from "@/lib/mock-data"
import { Bell, UploadCloud, ClipboardCheck } from "lucide-react"

const initialDocs = [
  { label: "Proposal Document", status: "Approved", updated: "Nov 18, 2025" },
  { label: "SRS Document", status: "In Review", updated: "Nov 24, 2025" },
  { label: "Final Documentation", status: "Pending Upload", updated: "—" },
]

export default function StudentDashboard() {
  const [documents] = useState(initialDocs)

  return (
    <div className="space-y-6">
      <FeatureGate feature="fyp:view_own_fyp">
        <QuickStats supervisor="Dr. Fatima Khan" ideaStatus="Approved" deadline="Dec 15, 2024" />
      </FeatureGate>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FeatureGate feature="fyp:track_progress">
          <div className="lg:col-span-2">
            <FYPProgress currentStage={4} status="In Review" />
          </div>
        </FeatureGate>

        <FeatureGate feature={["fyp:upload_proposal", "fyp:upload_srs", "fyp:upload_final_documentation"]} mode="any">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Document Center</h3>
              <UploadCloud className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.label}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{doc.label}</p>
                    <p className="text-xs text-slate-500">Last updated: {doc.updated}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    {doc.status === "Pending Upload" ? "Upload" : "View"}
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <a href="/student/fyp/proposal">Proposal Workspace</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/student/fyp/srs">SRS Workspace</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/student/fyp/final">Final Docs</a>
              </Button>
            </div>
          </Card>
        </FeatureGate>
      </div>

      <FeatureGate feature="fyp:view_own_fyp">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Stage Timeline</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {fypStages.map((stage, index) => (
              <div
                key={stage.id}
                className={`rounded-2xl border p-4 ${
                  index < 4 ? "border-emerald-200 bg-emerald-50" : index === 4 ? "border-indigo-200 bg-indigo-50" : "border-slate-200"
                }`}
              >
                <p className="text-xs uppercase tracking-wide text-slate-500">{stage.name}</p>
                <p className="text-sm text-slate-600 mt-1">
                  Status: {index < 4 ? "Completed" : index === 4 ? "In Progress" : "Pending"}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </FeatureGate>

      <FeatureGate feature="clearance:view_multi_department_progress">
        <DegreeClearanceRing
          clearanceStatus={{
            department: "approved",
            academic: "approved",
            student_affairs: "in_review",
            accounts: "pending",
          }}
        />
      </FeatureGate>

      <FeatureGate feature="clearance:submit_request">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Degree clearance</p>
              <h3 className="text-lg font-semibold">Ready to submit?</h3>
            </div>
            <ClipboardCheck className="w-5 h-5 text-slate-400" />
          </div>
          <Button className="mt-4" asChild>
            <a href="/student/clearance">Open Clearance Portal</a>
          </Button>
        </Card>
      </FeatureGate>

      <FeatureGate feature="notifications:view">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Recent Notifications</h3>
          </div>
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.read ? "bg-gray-300" : "bg-blue-500"}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </FeatureGate>
    </div>
  )
}
