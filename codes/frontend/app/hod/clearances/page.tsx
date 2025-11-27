"use client"

import { useState } from "react"
import { ClearanceTable } from "@/components/clearance/clearance-table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function HODClearancesPage() {
  const [approved, setApproved] = useState<string[]>([])

  const handleApprove = (id: string) => {
    setApproved([...approved, id])
  }

  const handleBulkApprove = () => {
    alert("Bulk approve feature - Select clearances and approve together")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Department Clearances</h1>
          <p className="text-gray-600">Approve or reject student clearance requests</p>
        </div>
        <Button onClick={handleBulkApprove} className="gap-2">
          <CheckCircle className="w-4 h-4" />
          Bulk Approve
        </Button>
      </div>

      <Card className="p-6">
        <ClearanceTable role="hod" onApprove={handleApprove} onReject={(id) => console.log("Reject:", id)} />
      </Card>
    </div>
  )
}
