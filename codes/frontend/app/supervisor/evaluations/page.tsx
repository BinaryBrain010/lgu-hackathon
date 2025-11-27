"use client"

import { useState } from "react"
import { supervisorStudents, evaluationRubric } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText } from "lucide-react"

export default function EvaluationsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [evaluation, setEvaluation] = useState<Record<string, number>>({})
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState<string[]>([])

  const currentStudent = supervisorStudents.find((s) => s.id === selectedStudent)

  const handleMarkChange = (category: string, marks: number) => {
    setEvaluation({ ...evaluation, [category]: marks })
  }

  const handleSubmit = () => {
    if (selectedStudent && Object.keys(evaluation).length === evaluationRubric.length) {
      setSubmitted([...submitted, selectedStudent])
      setSelectedStudent(null)
      setEvaluation({})
      setFeedback("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">FYP Evaluations</h1>
        <p className="text-gray-600">Evaluate and provide feedback on student FYPs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Students</h3>
            <div className="space-y-2">
              {supervisorStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedStudent === student.id
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-gray-50 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                  <p className="text-xs text-gray-600">{student.fyp.title}</p>
                  {submitted.includes(student.id) && <Badge className="mt-2 bg-green-500">Submitted</Badge>}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Evaluation Form */}
        {currentStudent && (
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{currentStudent.name}</h3>
                <p className="text-sm text-gray-600">{currentStudent.fyp.title}</p>
                <p className="text-sm text-gray-500 mt-2">Domain: {currentStudent.fyp.domain}</p>
              </div>

              <div className="space-y-6">
                {/* Rubric Items */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Evaluation Rubric</h4>
                  {evaluationRubric.map((rubric) => (
                    <div key={rubric.category} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{rubric.category}</p>
                          <p className="text-xs text-gray-600">{rubric.description}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">/ {rubric.maxMarks}</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max={rubric.maxMarks}
                        value={evaluation[rubric.category] ?? ""}
                        onChange={(e) => handleMarkChange(rubric.category, Number.parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter marks (0-${rubric.maxMarks})`}
                      />
                    </div>
                  ))}
                </div>

                {/* Feedback */}
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                    placeholder="Provide constructive feedback..."
                  />
                </div>

                {/* Total Marks */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">Total Marks</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Object.values(evaluation).reduce((a, b) => a + b, 0)} / 80
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(evaluation).length !== evaluationRubric.length}
                  className="w-full"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Evaluation
                </Button>
              </div>
            </Card>
          </div>
        )}

        {!currentStudent && (
          <div className="lg:col-span-2">
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a student to begin evaluation</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
