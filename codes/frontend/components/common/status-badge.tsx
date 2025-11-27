"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react"

interface StatusBadgeProps {
  status: "approved" | "pending" | "in_review" | "rejected" | string
  size?: "sm" | "md" | "lg"
}

const statusConfig = {
  approved: {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    label: "Approved",
  },
  pending: {
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    label: "Pending",
  },
  in_review: {
    color: "bg-blue-100 text-blue-800",
    icon: AlertCircle,
    label: "In Review",
  },
  rejected: {
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    label: "Rejected",
  },
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  const Icon = config.icon

  const sizeClass = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"

  return (
    <Badge className={`${config.color} ${sizeClass}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}
