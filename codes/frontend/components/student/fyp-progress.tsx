"use client"

import { fypStages } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock } from "lucide-react"

interface FYPProgressProps {
  currentStage: number
  status: string
}

export function FYPProgress({ currentStage, status }: FYPProgressProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">FYP Progress Timeline</h3>

      {/* Visual Timeline */}
      <div className="flex items-center justify-between mb-8">
        {fypStages.map((stage, index) => (
          <div key={stage.id} className="flex flex-col items-center flex-1">
            {/* Stage Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-semibold text-sm transition-all ${
                stage.id < currentStage
                  ? "bg-green-500 text-white"
                  : stage.id === currentStage
                    ? "bg-blue-500 text-white ring-4 ring-blue-200"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {stage.id < currentStage ? <CheckCircle className="w-5 h-5" /> : stage.id}
            </div>

            {/* Stage Name */}
            <p className="text-xs font-medium text-center text-gray-700">{stage.name}</p>

            {/* Connecting Line */}
            {index < fypStages.length - 1 && (
              <div
                className={`absolute w-16 h-1 mt-5 ${stage.id < currentStage ? "bg-green-500" : "bg-gray-300"}`}
                style={{
                  marginLeft: "2rem",
                  top: "2.5rem",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current Status */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div>
          <p className="text-sm text-gray-600">Current Stage</p>
          <p className="font-semibold text-gray-900">{fypStages.find((s) => s.id === currentStage)?.name}</p>
        </div>
        <Badge variant="default">
          <Clock className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      </div>
    </Card>
  )
}
