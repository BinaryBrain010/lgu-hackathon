"use client"

import { ClearanceTable } from "@/components/clearance/clearance-table"
import { Card } from "@/components/ui/card"

export default function AccountsClearancesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accounts Clearances</h1>
        <p className="text-gray-600">Review financial clearance requests</p>
      </div>

      <Card className="p-6">
        <ClearanceTable
          role="accounts"
          onApprove={(id) => console.log("Approved:", id)}
          onReject={(id) => console.log("Rejected:", id)}
        />
      </Card>
    </div>
  )
}
