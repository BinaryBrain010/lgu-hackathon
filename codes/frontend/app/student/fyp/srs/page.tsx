"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FeatureGate } from "@/components/access/feature-gate"
import { ClipboardList } from "lucide-react"

type Revision = {
  id: number
  summary: string
  reviewer: string
  status: "submitted" | "feedback" | "approved"
  updatedOn: string
}

export default function SRSWorkspace() {
  const [revisions, setRevisions] = useState<Revision[]>([
    {
      id: 1,
      summary: "Rev 2: Added sequence diagrams for onboarding flow",
      reviewer: "Dr. Fatima Khan",
      status: "feedback",
      updatedOn: "Nov 24, 2025",
    },
  ])

  const [notes, setNotes] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleUpload = () => {
    if (!notes) return
    setUploading(true)
    setTimeout(() => {
      setRevisions((prev) => [
        {
          id: prev.length + 1,
          summary: notes,
          reviewer: "Pending Reviewer",
          status: "submitted",
          updatedOn: new Date().toLocaleDateString(),
        },
        ...prev,
      ])
      setNotes("")
      setUploading(false)
    }, 800)
  }

  return (
    <FeatureGate feature="fyp:upload_srs">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">SRS workspace</p>
          <h1 className="text-3xl font-semibold text-slate-900">Structure your system requirements.</h1>
          <p className="text-sm text-slate-600">
            Upload the latest SRS (PDF/Doc), summarize changes, and keep a trail of reviewer decisions.
          </p>
        </header>

        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Change summary</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Describe any updates, diagrams, or scope changes"
            />
          </div>
          <div className="flex items-center gap-3">
            <input type="file" required className="text-sm text-slate-600" />
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload SRS"}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Revision log</h3>
            <ClipboardList className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {revisions.map((revision) => (
              <div
                key={revision.id}
                className="rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{revision.summary}</p>
                  <p className="text-xs text-slate-500">
                    Reviewer: {revision.reviewer} · Updated {revision.updatedOn}
                  </p>
                </div>
                <Badge
                  className={
                    revision.status === "approved"
                      ? "bg-emerald-500"
                      : revision.status === "feedback"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                  }
                >
                  {revision.status === "feedback" ? "Needs Feedback" : revision.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </FeatureGate>
  )
}

