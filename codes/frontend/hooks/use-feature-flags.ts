"use client"

import { useEffect, useMemo, useState } from "react"
import {
  FEATURE_COOKIE_KEY,
  sanitizePermissions,
  type FeaturePermission,
} from "@/lib/permissions"

function readCookie(name: string) {
  if (typeof document === "undefined") return null
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
  return value ? decodeURIComponent(value.split("=")[1]) : null
}

function parseCookiePermissions() {
  const cookieValue = readCookie(FEATURE_COOKIE_KEY)
  if (!cookieValue) return []
  try {
    const parsed = JSON.parse(cookieValue)
    return sanitizePermissions(Array.isArray(parsed) ? parsed : [])
  } catch {
    return []
  }
}

export function useFeatureFlags() {
  const [features, setFeatures] = useState<FeaturePermission[]>([])

  useEffect(() => {
    setFeatures(parseCookiePermissions())
  }, [])

  return features
}

export function hasFeature(
  features: FeaturePermission[],
  required: FeaturePermission | FeaturePermission[],
  mode: "any" | "all" = "any",
) {
  const requirementArray = Array.isArray(required) ? required : [required]
  if (requirementArray.length === 0) return true
  if (mode === "all") {
    return requirementArray.every((feature) => features.includes(feature))
  }
  return requirementArray.some((feature) => features.includes(feature))
}

export function useHasFeature(required: FeaturePermission | FeaturePermission[], mode: "any" | "all" = "any") {
  const features = useFeatureFlags()

  return useMemo(() => hasFeature(features, required, mode), [features, required, mode])
}

