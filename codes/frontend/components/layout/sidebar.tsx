"use client"

import { useAuthStore } from "@/lib/store"

export function Sidebar() {
  const user = useAuthStore((state) => state.user)
  if (!user) return null
  return null
}

