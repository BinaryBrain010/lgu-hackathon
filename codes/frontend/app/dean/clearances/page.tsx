"use client"

import { ClearanceTable } from "@/components/clearance/clearance-table"
import { Card } from "@/components/ui/card"

export default function DeanClearancesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Academic Clearances</h1>
        <p className="text-gray-600">Review and approve academic clearance requests</p>
      </div>

      <Card className="p-6">
        <ClearanceTable
          role="dean"
          onApprove={(id) => console.log("Approved:", id)}
          onReject={(id) => console.log("Rejected:", id)}
        />
      </Card>
    </div>
  )
}
