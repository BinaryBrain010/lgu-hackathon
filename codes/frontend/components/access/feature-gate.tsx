"use client"

import type { ReactNode } from "react"
import { useHasFeature } from "@/hooks/use-feature-flags"
import type { FeaturePermission } from "@/lib/permissions"

type FeatureGateProps = {
  feature: FeaturePermission | FeaturePermission[]
  mode?: "any" | "all"
  fallback?: ReactNode
  children: ReactNode
}

export function FeatureGate({ feature, mode = "any", fallback = null, children }: FeatureGateProps) {
  const allowed = useHasFeature(feature, mode)

  if (!allowed) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

