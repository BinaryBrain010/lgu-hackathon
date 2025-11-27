"use client"

import { useState } from "react"
import { supervisors } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Mail } from "lucide-react"

export default function SelectSupervisorPage() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Select Your Supervisor</h1>
        <p className="text-gray-600">Choose from available supervisors for your FYP</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supervisors.map((supervisor) => (
          <Card
            key={supervisor.id}
            className={`p-6 cursor-pointer transition-all border-2 ${
              selected === supervisor.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelected(supervisor.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{supervisor.name}</h3>
                <p className="text-sm text-gray-600">{supervisor.department}</p>
              </div>
              {selected === supervisor.id && <div className="w-4 h-4 bg-blue-500 rounded-full" />}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-500" />
                <span>{supervisor.assignedStudents} Students Assigned</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="truncate">{supervisor.email}</span>
              </div>

              <div className="pt-2">
                <p className="text-xs font-medium text-gray-600 mb-2">Expertise:</p>
                <div className="flex flex-wrap gap-1">
                  {supervisor.expertise.map((exp) => (
                    <Badge key={exp} variant="outline" className="text-xs">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selected && (
        <div className="flex gap-3 sticky bottom-6">
          <Button className="flex-1">Confirm Selection</Button>
          <Button variant="outline" onClick={() => setSelected(null)}>
            Clear
          </Button>
        </div>
      )}
    </div>
  )
}
