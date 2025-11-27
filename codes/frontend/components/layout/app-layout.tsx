"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar />
        <main className="pt-20 pb-8 px-4 md:px-8 bg-gray-50 min-h-screen">{children}</main>
      </div>
    </div>
  )
}
