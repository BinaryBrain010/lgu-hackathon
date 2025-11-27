"use client"

import { useAuthStore } from "@/lib/store"
import { usePathname } from "next/navigation"
import { Bell, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { notifications } from "@/lib/mock-data"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useFeatureFlags, hasFeature } from "@/hooks/use-feature-flags"

export function Navbar() {
  const user = useAuthStore((state) => state.user)
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)
  const features = useFeatureFlags()
  const canViewNotifications = hasFeature(features, "notifications:view")
  const unreadCount = canViewNotifications ? notifications.filter((n) => !n.read).length : 0

  if (!user || pathname === "/login") return null

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length === 0) return "Dashboard"
    return segments[segments.length - 1]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <nav className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white border-b border-gray-200 shadow-sm z-20 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        {canViewNotifications && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 border-b">
                <p className="text-sm font-semibold text-gray-900">Notifications</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 border-b text-sm cursor-pointer hover:bg-gray-50 ${
                        !notif.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex gap-2">
                        <div
                          className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                            notif.read ? "bg-gray-300" : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Dark mode toggle */}
        <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* User avatar */}
        <Avatar className="w-9 h-9">
          <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">{user.avatar}</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  )
}
