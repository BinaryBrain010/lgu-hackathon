"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Plus } from "lucide-react"

export default function FYPIdeaPage() {
  const [ideas, setIdeas] = useState([
    {
      id: 1,
      title: "AI-Powered Document Classification System",
      description: "Machine learning system for automated document classification",
      domain: "Machine Learning",
      status: "approved",
      submittedDate: "Oct 15, 2024",
    },
  ])

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "", domain: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.description) {
      setIdeas([
        ...ideas,
        {
          id: ideas.length + 1,
          ...formData,
          status: "pending",
          submittedDate: new Date().toLocaleDateString(),
        },
      ])
      setFormData({ title: "", description: "", domain: "" })
      setIsFormOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">FYP Ideas</h1>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="gap-2">
          <Plus className="w-4 h-4" />
          Submit Idea
        </Button>
      </div>

      {/* Submission Form */}
      {isFormOpen && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Idea Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your FYP idea title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                placeholder="Describe your FYP idea"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Machine Learning, Web Development"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Submit Idea</Button>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Ideas List */}
      <div className="space-y-4">
        {ideas.map((idea) => (
          <Card key={idea.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
                </div>
              </div>
              <Badge
                variant={
                  idea.status === "approved" ? "default" : idea.status === "rejected" ? "destructive" : "secondary"
                }
              >
                {idea.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">Domain: {idea.domain}</span>
                <span className="text-gray-500">Submitted: {idea.submittedDate}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
