"use client"

import type React from "react"

import { Navbar } from "./navbar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
      <main className="pt-20 pb-8 px-4 md:px-8">{children}</main>
    </div>
  )
}
