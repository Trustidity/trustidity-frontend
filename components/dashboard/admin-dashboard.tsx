"use client"

import { DashboardLayout } from "./dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Building, FileText, Shield, TrendingUp, AlertTriangle, DollarSign } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Shield, current: true },
  { name: "User Management", href: "/dashboard/users", icon: Users },
  { name: "Institutions", href: "/dashboard/institutions", icon: Building },
  { name: "Pricing", href: "/dashboard/pricing", icon: DollarSign },
  { name: "System Logs", href: "/dashboard/logs", icon: FileText },
]

// Mock data
const systemStats = {
  totalUsers: 15847,
  totalInstitutions: 342,
  totalVerifications: 89234,
  activeVerifications: 1247,
  systemUptime: "99.9%",
  avgResponseTime: "0.8s",
}

const recentUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    role: "individual",
    status: "active",
    joinDate: "2024-01-20",
  },
  {
    id: "2",
    name: "Harvard University",
    email: "admin@harvard.edu",
    role: "institution",
    status: "active",
    joinDate: "2024-01-19",
  },
  {
    id: "3",
    name: "TechCorp HR",
    email: "hr@techcorp.com",
    role: "employer",
    status: "pending",
    joinDate: "2024-01-18",
  },
]

const systemAlerts = [
  { id: "1", type: "warning", message: "High verification volume detected", time: "2 hours ago" },
  { id: "2", type: "info", message: "New institution partnership approved", time: "4 hours ago" },
  { id: "3", type: "error", message: "Failed verification attempt from suspicious IP", time: "6 hours ago" },
]

export function AdminDashboard() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <FileText className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management controls</p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Institutions</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalInstitutions}</div>
              <p className="text-xs text-muted-foreground">+5 new this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalVerifications.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+23% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Verifications</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.activeVerifications.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Currently processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.systemUptime}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.avgResponseTime}</div>
              <p className="text-xs text-muted-foreground">API response time</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest user registrations and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.email} • {user.role} • Joined {user.joinDate}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(user.status)}
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Recent system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Button className="justify-start bg-transparent" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button className="justify-start bg-transparent" variant="outline">
                <Building className="mr-2 h-4 w-4" />
                Add Institution
              </Button>
              <Button className="justify-start bg-transparent" variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                Manage Pricing
              </Button>
              <Button className="justify-start bg-transparent" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View System Logs
              </Button>
              <Button className="justify-start bg-transparent" variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Security Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
