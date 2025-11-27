"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FeatureGate } from "@/components/access/feature-gate"
import { UploadCloud, CheckCircle2 } from "lucide-react"

type Submission = {
  id: number
  title: string
  comment: string
  status: "submitted" | "approved" | "changes_required"
  submittedOn: string
}

export default function ProposalWorkspace() {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 1,
      title: "AI-Powered Document Classification System",
      comment: "Rev 1 aligned with supervisor feedback",
      status: "approved",
      submittedOn: "Nov 18, 2025",
    },
  ])

  const [formData, setFormData] = useState({ title: "", comment: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formData.title) return
    setIsSubmitting(true)
    setTimeout(() => {
      setSubmissions((prev) => [
        {
          id: prev.length + 1,
          title: formData.title,
          comment: formData.comment,
          status: "submitted",
          submittedOn: new Date().toLocaleDateString(),
        },
        ...prev,
      ])
      setFormData({ title: "", comment: "" })
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <FeatureGate feature="fyp:upload_proposal">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Proposal workspace</p>
            <h1 className="text-3xl font-semibold text-slate-900">Upload & iterate on your proposal</h1>
            <p className="text-sm text-slate-600">
              Attach the latest draft, leave context for reviewers, and track approval history.
            </p>
          </div>
          <UploadCloud className="w-10 h-10 text-slate-400 hidden md:block" />
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Proposal title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., AI-Powered Document Classification System"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Comments for supervisor</label>
              <textarea
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Highlight updates, questions, or blockers"
              />
            </div>
            <div className="flex items-center gap-3">
              <input type="file" required className="text-sm text-slate-600" />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Submit Proposal"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Submission history</h3>
          <div className="space-y-3">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{submission.title}</p>
                  <p className="text-xs text-slate-500">{submission.comment || "No comments"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      submission.status === "approved"
                        ? "bg-emerald-500"
                        : submission.status === "changes_required"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                    }
                  >
                    {submission.status.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-slate-500">{submission.submittedOn}</span>
                  {submission.status === "approved" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </FeatureGate>
  )
}

