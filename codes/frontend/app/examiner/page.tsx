"use client"

import { useState } from "react"
import { supervisorStudents, examinerReports } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FeatureGate } from "@/components/access/feature-gate"
import { CheckCircle2, ClipboardList, Clock, Sparkles, TrendingUp } from "lucide-react"

const evaluationWindows = [
  { label: "Proposal defense", due: "Nov 28", status: "In progress" },
  { label: "SRS evaluation", due: "Dec 02", status: "Queued" },
  { label: "Final defense", due: "Dec 10", status: "Scheduled" },
]

export default function ExaminerDashboard() {
  const assignedFYPs = supervisorStudents.length
  const evaluated = Math.floor(assignedFYPs / 3)
  const pending = assignedFYPs - evaluated
  const completion = assignedFYPs > 0 ? Math.round((evaluated / assignedFYPs) * 100) : 0

  const [reportGenerating, setReportGenerating] = useState<string | null>(null)

  function generateReport(id: string) {
    setReportGenerating(id)
    setTimeout(() => setReportGenerating(null), 1500)
  }

  return (
    <div className="space-y-8 text-slate-900">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Examiner console</p>
        <h1 className="text-3xl font-semibold text-slate-900">Stay ahead of every evaluation window.</h1>
        <p className="text-sm text-slate-500">
          Monitor assigned journeys, capture decisions, and keep internal/external committees in sync.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-5 border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Assigned FYPs</p>
              <p className="text-3xl font-semibold mt-1 text-slate-900">{assignedFYPs}</p>
            </div>
            <ClipboardList className="h-6 w-6 text-slate-500" />
          </div>
        </Card>

        <Card className="p-5 border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Evaluated</p>
              <p className="text-3xl font-semibold mt-1 text-emerald-600">{evaluated}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
        </Card>

        <Card className="p-5 border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Pending</p>
              <p className="text-3xl font-semibold mt-1 text-amber-600">{pending}</p>
            </div>
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
        </Card>

        <Card className="p-5 border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Completion</p>
              <p className="text-3xl font-semibold mt-1 text-indigo-600">{completion}%</p>
            </div>
            <TrendingUp className="h-6 w-6 text-indigo-500" />
          </div>
          <Progress value={completion} className="h-2" />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <FeatureGate feature="evaluation:view_assigned_evaluations">
          <Card className="p-6 h-full border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Evaluation queue</p>
                <h2 className="text-2xl font-semibold text-slate-900">Assigned FYPs</h2>
              </div>
              <Badge variant="outline" className="text-xs">
                {pending} pending
              </Badge>
            </div>
            <div className="space-y-4">
              {supervisorStudents.map((student, idx) => {
                const completed = idx < evaluated
                return (
                  <div
                    key={student.id}
                    className="rounded-2xl border border-slate-200 p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{student.name}</h3>
                      <p className="text-sm text-slate-500">{student.fyp.title}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">
                    {student.fyp.domain}
                  </Badge>
                        <Badge className={completed ? "bg-emerald-500" : "bg-amber-500"}>
                          {completed ? "Evaluated" : "Pending"}
                  </Badge>
                      </div>
                    </div>
                    <FeatureGate feature={completed ? "evaluation:enter_feedback" : "evaluation:conduct_evaluation"}>
                      <Button size="sm" variant={completed ? "outline" : "default"}>
                        {completed ? "View Evaluation" : "Evaluate"}
                      </Button>
                    </FeatureGate>
                  </div>
                )
              })}
            </div>
          </Card>
        </FeatureGate>

        <div className="space-y-6">
          <FeatureGate feature="evaluation:evaluate_proposal">
            <Card className="p-6 border border-slate-200 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Next milestones</p>
                  <h3 className="text-lg font-semibold">Evaluation timeline</h3>
                </div>
              </div>
              <div className="space-y-3">
                {evaluationWindows.map((window) => (
                  <div key={window.label} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{window.label}</p>
                        <p className="text-xs text-slate-500">Due {window.due}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {window.status}
                      </Badge>
                    </div>
            </div>
          ))}
        </div>
      </Card>
          </FeatureGate>

          <FeatureGate feature="evaluation:enter_marks">
            <Card className="p-6 border border-slate-200 bg-white">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Quality signals</p>
              <h3 className="text-lg font-semibold mt-2">Evaluation integrity checklist</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>• Plagiarism & AI similarity reports attached before scoring</li>
                <li>• Marks + qualitative feedback submitted together</li>
                <li>• Internal to external handoff captured in less than 48h</li>
              </ul>
            </Card>
          </FeatureGate>

          <FeatureGate feature="evaluation:view_assigned_evaluations">
            <Card className="p-6 border border-slate-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Reports</p>
                  <h3 className="text-lg font-semibold">Latest exports</h3>
                </div>
              </div>
              <div className="space-y-3">
                {examinerReports.map((report) => (
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
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={Boolean(reportGenerating) && reportGenerating !== report.id}
                      onClick={() => generateReport(report.id)}
                    >
                      {reportGenerating === report.id ? "Preparing..." : "Download"}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </FeatureGate>
        </div>
      </div>
    </div>
  )
}
