"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { users, overallStats } from "@/lib/admin-data"
import { Users, Settings, BarChart3, AlertCircle } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.totalUsers}</p>
            </div>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Active FYPs</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.activeFYPs}</p>
            </div>
            <BarChart3 className="w-5 h-5 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.completedFYPs}</p>
            </div>
            <Badge className="bg-green-500">Active</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">System Health</p>
              <p className="text-2xl font-bold text-gray-900">99%</p>
            </div>
            <AlertCircle className="w-5 h-5 text-green-500" />
          </div>
        </Card>
      </div>

      {/* User Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">User Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600 truncate">{user.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.department}</td>
                  <td className="py-3 px-4 text-center">
                    <Button size="sm" variant="ghost">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* System Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">System Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start h-12 bg-transparent">
            <Settings className="w-4 h-4 mr-2" />
            Configure System Settings
          </Button>
          <Button variant="outline" className="justify-start h-12 bg-transparent">
            <BarChart3 className="w-4 h-4 mr-2" />
            View System Logs
          </Button>
          <Button variant="outline" className="justify-start h-12 bg-transparent">
            <Users className="w-4 h-4 mr-2" />
            Manage Roles
          </Button>
          <Button variant="outline" className="justify-start h-12 bg-transparent">
            <AlertCircle className="w-4 h-4 mr-2" />
            System Backup
          </Button>
        </div>
      </Card>
    </div>
  )
}
