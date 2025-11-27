"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, CheckCircle } from "lucide-react"

interface QuickStatsProps {
  supervisor: string
  ideaStatus: string
  deadline: string
}

export function QuickStats({ supervisor, ideaStatus, deadline }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-600 mb-1">Supervisor</p>
            <p className="font-semibold text-gray-900">{supervisor}</p>
          </div>
          <User className="w-5 h-5 text-blue-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-600 mb-1">Idea Status</p>
            <Badge variant="default">{ideaStatus}</Badge>
          </div>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-600 mb-1">Next Deadline</p>
            <p className="font-semibold text-gray-900">{deadline}</p>
          </div>
          <Calendar className="w-5 h-5 text-orange-500" />
        </div>
      </Card>
    </div>
  )
}
