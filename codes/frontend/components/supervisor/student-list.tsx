"use client"

import type React from "react"

import { supervisorStudents } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, FileText, MessageSquare, CheckCircle } from "lucide-react"
import { useState } from "react"

interface StudentListProps {
  onSelectStudent?: (studentId: string) => void
}

export function StudentList({ onSelectStudent }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = supervisorStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fyp.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    proposal_review: { color: "bg-yellow-100 text-yellow-800", icon: <FileText className="w-4 h-4" /> },
    srs_review: { color: "bg-blue-100 text-blue-800", icon: <FileText className="w-4 h-4" /> },
    internal_review: { color: "bg-purple-100 text-purple-800", icon: <CheckCircle className="w-4 h-4" /> },
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name or FYP title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Student Cards */}
      <div className="space-y-3">
        {filtered.map((student) => (
          <Card key={student.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600 truncate">{student.fyp.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {student.fyp.domain}
                  </Badge>
                  <Badge className={`text-xs ${statusConfig[student.fyp.status]?.color}`}>Stage {student.stage}</Badge>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="ghost" onClick={() => onSelectStudent?.(student.id)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={() => onSelectStudent?.(student.id)}>
                  Review
                </Button>
              </div>
            </div>

            {student.pendingActions.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs font-medium text-gray-600 mb-2">Pending Actions:</p>
                <div className="flex flex-wrap gap-1">
                  {student.pendingActions.map((action, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
