"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FeatureGate } from "@/components/access/feature-gate"
import { clearanceRequests } from "@/lib/mock-data"
import { Wallet, Clock3, CheckCircle2, AlertTriangle, FileSpreadsheet } from "lucide-react"

export default function AccountsDashboard() {
  const accountsClearances = clearanceRequests.filter((c) => c.department === "accounts")
  const pending = accountsClearances.filter((c) => c.status === "pending")
  const approved = accountsClearances.filter((c) => c.status === "approved")
  const inReview = accountsClearances.filter((c) => c.status === "in_review")

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Accounts office</p>
        <h1 className="text-3xl font-semibold text-slate-900">Clear financial dues without spreadsheets or emails.</h1>
        <p className="text-sm text-slate-600">
          Reconcile outstanding payments, auto-notify students, and approve requests directly from the command center.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-5 border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Total requests</p>
              <p className="text-3xl font-semibold mt-1 text-slate-900">{accountsClearances.length}</p>
            </div>
            <Wallet className="h-6 w-6 text-slate-500" />
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
              <p className="text-xs uppercase tracking-wide text-slate-500">Cleared</p>
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
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Financial ledger</p>
              <h2 className="text-xl font-semibold text-slate-900">Accounts clearance status</h2>
            </div>
            <Badge variant="outline" className="text-xs">
              {pending.length} pending
            </Badge>
          </div>
          <div className="space-y-3">
            {accountsClearances.map((req) => (
              <div key={req.id} className="rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{req.studentName}</p>
                  <p className="text-xs text-slate-500">Request #{req.id}</p>
                </div>
                <Badge className={req.status === "approved" ? "bg-emerald-500" : req.status === "pending" ? "bg-amber-500" : "bg-indigo-500"}>
                  {req.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </FeatureGate>

      <FeatureGate feature="clearance:approve_financial_clearance">
        <Card className="p-6 border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Quick actions</h3>
            <FileSpreadsheet className="h-5 w-5 text-slate-400" />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Button>Review financial status</Button>
            <Button variant="outline">Generate invoice report</Button>
            <Button variant="outline">Sync with ERP</Button>
          </div>
        </Card>
      </FeatureGate>
    </div>
  )
}
