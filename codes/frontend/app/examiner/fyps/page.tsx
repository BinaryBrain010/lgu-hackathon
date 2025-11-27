"use client"

import { supervisorStudents } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download } from "lucide-react"
import { useState } from "react"

export default function ExaminerFYPsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const currentStudent = supervisorStudents.find((s) => s.id === selectedStudent)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Assigned FYPs</h1>
        <p className="text-gray-600">Review and evaluate assigned student FYPs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FYP List */}
        <div>
          <Card className="p-4">
            <h3 className="font-semibold mb-4">FYPs</h3>
            <div className="space-y-2">
              {supervisorStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                    selectedStudent === student.id
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-gray-50 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-600 truncate">{student.fyp.title}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* FYP Details */}
        {currentStudent ? (
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">{currentStudent.name}</h2>
                <p className="text-gray-600 mt-2">{currentStudent.fyp.title}</p>
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Student ID</p>
                    <p className="font-medium text-gray-900">{currentStudent.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Domain</p>
                    <Badge variant="outline">{currentStudent.fyp.domain}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Stage</p>
                    <p className="font-medium text-gray-900">Stage {currentStudent.stage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className="capitalize">{currentStudent.fyp.status}</Badge>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="mt-4 space-y-3">
                  {["FYP_Proposal.pdf", "SRS_Document.pdf", "Final_Submission.pdf"].map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700">{file}</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="feedback" className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Provide Feedback</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                      placeholder="Enter your evaluation feedback..."
                    />
                  </div>
                  <Button className="w-full">Submit Evaluation</Button>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        ) : (
          <div className="lg:col-span-2">
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Select an FYP to view details</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
