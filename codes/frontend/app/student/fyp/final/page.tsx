"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FeatureGate } from "@/components/access/feature-gate"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, FileText } from "lucide-react"

type FinalDeliverable = {
  id: number
  artifact: string
  status: "pending" | "submitted" | "approved"
  lastUpdated: string
}

export default function FinalDocsPage() {
  const [deliverables, setDeliverables] = useState<FinalDeliverable[]>([
    { id: 1, artifact: "Final Report (PDF)", status: "submitted", lastUpdated: "Nov 27, 2025" },
    { id: 2, artifact: "Source Code Archive", status: "pending", lastUpdated: "—" },
    { id: 3, artifact: "Presentation Slides", status: "pending", lastUpdated: "—" },
  ])
  const [uploadingId, setUploadingId] = useState<number | null>(null)

  const handleUpload = (id: number) => {
    setUploadingId(id)
    setTimeout(() => {
      setDeliverables((prev) =>
        prev.map((deliverable) =>
          deliverable.id === id
            ? { ...deliverable, status: "submitted", lastUpdated: new Date().toLocaleDateString() }
            : deliverable
        )
      )
      setUploadingId(null)
    }, 800)
  }

  return (
    <FeatureGate feature="fyp:upload_final_documentation">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Final documentation</p>
          <h1 className="text-3xl font-semibold text-slate-900">Hand over every artifact with confidence.</h1>
          <p className="text-sm text-slate-600">
            Upload the final report, slides, and codebase once internal & external evaluations are done.
          </p>
        </header>

        <Card className="p-6 space-y-4">
          <div className="grid gap-3">
            {deliverables.map((deliverable) => (
              <div
                key={deliverable.id}
                className="rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{deliverable.artifact}</p>
                    <p className="text-xs text-slate-500">Updated: {deliverable.lastUpdated}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      deliverable.status === "approved"
                        ? "bg-emerald-500"
                        : deliverable.status === "submitted"
                          ? "bg-blue-500"
                          : "bg-amber-500"
                    }
                  >
                    {deliverable.status}
                  </Badge>
                  {deliverable.status === "approved" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpload(deliverable.id)}
                      disabled={uploadingId !== null}
                    >
                      {uploadingId === deliverable.id ? "Uploading..." : "Upload"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </FeatureGate>
  )
}

