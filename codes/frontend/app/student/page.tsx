"use client"

import { FYPProgress } from "@/components/student/fyp-progress"
import { DegreeClearanceRing } from "@/components/student/degree-clearance-ring"
import { QuickStats } from "@/components/student/quick-stats"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FeatureGate } from "@/components/access/feature-gate"
import { notifications } from "@/lib/mock-data"
import { Bell, FileText } from "lucide-react"

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <FeatureGate feature="fyp:view_own_fyp">
        <QuickStats supervisor="Dr. Fatima Khan" ideaStatus="Approved" deadline="Dec 15, 2024" />
      </FeatureGate>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FYP Progress - Takes 2 columns */}
        <FeatureGate feature="fyp:track_progress">
          <div className="lg:col-span-2">
            <FYPProgress currentStage={4} status="In Review" />
          </div>
        </FeatureGate>

        {/* Degree Clearance - Takes 1 column */}
        <FeatureGate feature={["fyp:upload_srs", "fyp:upload_final_documentation"]} mode="any">
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <div className="space-y-2">
                <FeatureGate feature="fyp:upload_srs">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Upload SRS
                  </Button>
                </FeatureGate>
                <FeatureGate feature="fyp:view_own_fyp">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    View Feedback
                  </Button>
                </FeatureGate>
                <FeatureGate feature="fyp:upload_final_documentation">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Submit Final
                  </Button>
                </FeatureGate>
              </div>
            </Card>
          </div>
        </FeatureGate>
      </div>

      {/* Degree Clearance Status */}
      <FeatureGate feature="clearance:view_multi_department_progress">
        <DegreeClearanceRing
          clearanceStatus={{
            department: "approved",
            academic: "approved",
            student_affairs: "in_review",
            accounts: "pending",
          }}
        />
      </FeatureGate>

      {/* Notifications */}
      <FeatureGate feature="notifications:view">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Recent Notifications</h3>
          </div>
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.read ? "bg-gray-300" : "bg-blue-500"}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </FeatureGate>
    </div>
  )
}
