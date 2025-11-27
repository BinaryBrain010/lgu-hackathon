"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FeatureGate } from "@/components/access/feature-gate"
import { clearanceRequests, deanReports } from "@/lib/mock-data"
import { CheckCircle2, Clock3, Download, Layers3, UsersRound } from "lucide-react"
import { useState } from "react"

export default function DeanDashboard() {
  const academicClearances = clearanceRequests.filter((c) => c.department === "academic")
  const pending = academicClearances.filter((c) => c.status === "pending")
  const approved = academicClearances.filter((c) => c.status === "approved")
  const inReview = academicClearances.filter((c) => c.status === "in_review")

  const total = academicClearances.length
  const completion = total > 0 ? Math.round((approved.length / total) * 100) : 0

  const [runningReportId, setRunningReportId] = useState<string | null>(null)

  const quickActions = [
    {
      label: runningReportId === "approve" ? "Approving..." : "Review pending clearances",
      feature: "clearance:approve_academic_clearance",
      action: () => triggerReport("approve"),
    },
    {
      label: runningReportId === "report" ? "Generating..." : "Generate compliance report",
      feature: "clearance:view_all_clearances",
      variant: "outline" as const,
      icon: <Download className="h-4 w-4" />,
      action: () => triggerReport("report"),
    },
    {
      label: runningReportId === "bulk" ? "Processing..." : "Bulk approve",
      feature: "clearance:confirm_academic_eligibility",
      variant: "outline" as const,
      action: () => triggerReport("bulk"),
    },
  ]

  function triggerReport(id: string) {
    setRunningReportId(id)
    setTimeout(() => setRunningReportId(null), 1500)
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Academic clearance desk</p>
        <h1 className="text-3xl font-semibold text-slate-900">Decide faster with a panoramic view of every request.</h1>
        <p className="text-sm text-slate-600">
          Surface at-risk cohorts, align student-affairs + accounts, and finalize academic eligibility in one hub.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-5 border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Total requests</p>
              <p className="text-3xl font-semibold mt-1 text-slate-900">{total}</p>
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
            <Layers3 className="h-6 w-6 text-indigo-500" />
          </div>
        </Card>

        <Card className="p-5 border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Approved</p>
              <p className="text-3xl font-semibold mt-1 text-emerald-600">{approved.length}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <Progress value={completion} className="h-2" />
          <p className="text-xs text-slate-500 mt-2">{completion}% completion rate</p>
        </Card>
      </div>

      <FeatureGate feature="clearance:view_all_clearances">
        <Card className="p-6 border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Quick actions</p>
              <h2 className="text-xl font-semibold text-slate-900">Orchestrate decisions</h2>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {quickActions.map((action) => (
              <FeatureGate key={action.label} feature={action.feature}>
                <Button
                  variant={action.variant}
                  className="justify-between"
                  disabled={Boolean(runningReportId)}
                  onClick={action.action}
                >
                  {action.label}
                  {action.icon}
                </Button>
              </FeatureGate>
            ))}
          </div>
        </Card>
      </FeatureGate>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <FeatureGate feature="clearance:view_all_clearances">
          <Card className="p-6 border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Pipeline visibility</p>
                <h3 className="text-xl font-semibold">Requests by stage</h3>
              </div>
              <span className="text-xs text-slate-500">{pending.length} pending</span>
            </div>
            <div className="space-y-4">
              {["Pending", "In Review", "Approved"].map((label) => {
                const value =
                  label === "Pending" ? pending.length : label === "In Review" ? inReview.length : approved.length
                const percent = total > 0 ? Math.round((value / total) * 100) : 0
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-1">
                      <span>{label}</span>
                      <span>{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>
                )
              })}
            </div>
          </Card>
        </FeatureGate>

        <FeatureGate feature="clearance:approve_academic_clearance">
          <Card className="p-6 border border-slate-200 bg-white">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Immediate attention</p>
            <h3 className="text-xl font-semibold mt-2">Students waiting on you</h3>
            <div className="mt-4 space-y-3">
              {pending.slice(0, 3).map((request) => (
                <div key={request.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{request.studentName}</p>
                      <p className="text-xs text-slate-500">{request.department}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
              {pending.length === 0 && <p className="text-sm text-slate-500">All clearances are up to date.</p>}
        </div>
      </Card>
        </FeatureGate>

        <FeatureGate feature="clearance:view_all_clearances">
          <Card className="p-6 border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Reports</p>
                <h3 className="text-xl font-semibold">Recent exports</h3>
              </div>
            </div>
            <div className="space-y-3">
              {deanReports.map((report) => (
                <div key={report.id} className="rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
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
    </div>
  )
}
