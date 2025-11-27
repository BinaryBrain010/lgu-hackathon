"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FeatureGate } from "@/components/access/feature-gate"
import { clearanceRequests, hodReports } from "@/lib/mock-data"
import { CheckCircle2, Clock3, UsersRound, AlertTriangle, ClipboardList } from "lucide-react"

export default function HODDashboard() {
  const departmentClearances = clearanceRequests.filter((c) => c.department === "department")
  const pending = departmentClearances.filter((c) => c.status === "pending")
  const approved = departmentClearances.filter((c) => c.status === "approved")
  const inReview = departmentClearances.filter((c) => c.status === "in_review")
  const [reportRunning, setReportRunning] = useState<string | null>(null)

  function runAction(action: string) {
    setReportRunning(action)
    setTimeout(() => setReportRunning(null), 1500)
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Department chair desk</p>
        <h1 className="text-3xl font-semibold text-slate-900">Keep supervisor assignments & clearances in lockstep.</h1>
        <p className="text-sm text-slate-600">
          Track every request, unblock bottlenecks, and nudge supervisors or accounts before students get stuck.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-5 border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Total requests</p>
              <p className="text-3xl font-semibold mt-1 text-slate-900">{departmentClearances.length}</p>
            </div>
            <UsersRound className="h-6 w-6 text-slate-500" />
          </div>
        </Card>

        <Card className="p-5 border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Pending</p>
              <p className="text-3xl font-semibold mt-1 text-amber-600">{pending.length}</p>
            </div>
            <Clock3 className="h-6 w-6 text-amber-500" />
          </div>
        </Card>

        <Card className="p-5 border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">In review</p>
              <p className="text-3xl font-semibold mt-1 text-indigo-600">{inReview.length}</p>
            </div>
            <AlertTriangle className="h-6 w-6 text-indigo-500" />
          </div>
        </Card>

        <Card className="p-5 border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Approved</p>
              <p className="text-3xl font-semibold mt-1 text-emerald-600">{approved.length}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
        </Card>
      </div>

      <FeatureGate feature="clearance:view_all_clearances">
        <Card className="p-6 border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Pipeline snapshots</p>
              <h2 className="text-xl font-semibold text-slate-900">Department clearance queue</h2>
            </div>
            <Badge variant="outline" className="text-xs">
              {pending.length} pending
            </Badge>
          </div>
          <div className="space-y-3">
            {departmentClearances.map((req) => (
              <div key={req.id} className="rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{req.studentName}</p>
                  <p className="text-xs text-slate-500">Request #{req.id} · {new Date(req.createdDate).toLocaleDateString()}</p>
                </div>
                <Badge className={req.status === "approved" ? "bg-emerald-500" : req.status === "pending" ? "bg-amber-500" : "bg-indigo-500"}>
                  {req.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </FeatureGate>

      <FeatureGate feature="fyp:view_all_fyps">
        <Card className="p-6 border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Quick actions</p>
              <h3 className="text-xl font-semibold">Supervisor coordination</h3>
            </div>
            <ClipboardList className="h-5 w-5 text-slate-400" />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Button onClick={() => runAction("review")} disabled={reportRunning === "cohort" || reportRunning === "notify"}>
              {reportRunning === "review" ? "Reviewing..." : "Review pending clearances"}
            </Button>
            <Button variant="outline" onClick={() => runAction("cohort")} disabled={reportRunning === "review" || reportRunning === "notify"}>
              {reportRunning === "cohort" ? "Preparing..." : "View cohort report"}
            </Button>
            <Button variant="outline" onClick={() => runAction("notify")} disabled={reportRunning === "review" || reportRunning === "cohort"}>
              {reportRunning === "notify" ? "Notifying..." : "Notify supervisors"}
            </Button>
          </div>
        </Card>
      </FeatureGate>

      <FeatureGate feature="clearance:view_all_clearances">
        <Card className="p-6 border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Reports</p>
              <h3 className="text-xl font-semibold">Recent downloads</h3>
            </div>
          </div>
          <div className="space-y-3">
            {hodReports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{report.title}</p>
                  <p className="text-xs text-slate-500">
                    {report.id} · Last run {report.lastRun} · Owner: {report.owner}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </FeatureGate>
    </div>
  )
}
