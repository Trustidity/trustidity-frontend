"use client"

import { DashboardLayout } from "./dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Building, FileText, Shield, TrendingUp, AlertTriangle, DollarSign } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { useApi } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Shield, current: true },
  { name: "User Management", href: "/dashboard/users", icon: Users },
  { name: "Institutions", href: "/dashboard/institutions", icon: Building },
  { name: "Pricing", href: "/dashboard/pricing", icon: DollarSign },
  { name: "System Logs", href: "/dashboard/logs", icon: FileText },
]

interface DashboardData {
  overview: {
    totalUsers: number
    totalInstitutions: number
    totalVerifications: number
    recentUsers: number
    recentVerifications: number
  }
  verificationStats: Array<{ status: string; count: string }>
  revenue: {
    totalRevenue: number
    paidVerifications: number
  }
  topInstitutions: Array<{ institutionName: string; verificationCount: string }>
}

interface AnalyticsData {
  totalVerifications: number
  successfulVerifications: number
  failedVerifications: number
  totalCredentials: number
  totalInstitutions: number
  totalUsers: number
  revenueData: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  verificationTrends: Array<{
    date: string
    count: number
    success: number
    failed: number
  }>
  topInstitutions: Array<{
    name: string
    credentialCount: number
    verificationCount: number
  }>
  geographicData: Array<{
    country: string
    region: string
    count: number
  }>
  fraudDetectionStats: {
    totalFlagged: number
    falsePositives: number
    truePositives: number
    accuracy: number
  }
}

export function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const api = useApi()
  const { toast } = useToast()

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [dashboardResponse, analyticsResponse] = await Promise.all([
        api.getDashboardStats(),
        api.getAnalyticsDashboard(),
      ])

      if (!dashboardResponse.success) {
        throw new Error(dashboardResponse.error || "Failed to fetch dashboard stats")
      }

      if (!analyticsResponse.success) {
        throw new Error(analyticsResponse.error || "Failed to fetch analytics data")
      }

      if (!dashboardResponse.data) {
        throw new Error("Dashboard stats data is missing")
      }

      if (!analyticsResponse.data) {
        throw new Error("Analytics data is missing")
      }

      setDashboardData(dashboardResponse.data)
      setAnalyticsData(analyticsResponse.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load dashboard data"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, []) // Removed API method dependencies to prevent infinite loop

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData]) // useEffect now only runs once on mount

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

  if (loading) {
    return (
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management controls</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="animate-pulse">
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management controls</p>
          </div>
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Failed to Load Dashboard</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchDashboardData}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!dashboardData || !analyticsData) {
    return null
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
              <div className="text-2xl font-bold">{dashboardData.overview.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{dashboardData.overview.recentUsers} new this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Institutions</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.overview.totalInstitutions}</div>
              <p className="text-xs text-muted-foreground">Active institutions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.overview.totalVerifications.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{dashboardData.overview.recentVerifications} this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {analyticsData.totalVerifications > 0
                  ? Math.round((analyticsData.successfulVerifications / analyticsData.totalVerifications) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Verification success rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₦{analyticsData.revenueData.thisMonth.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.revenueData.growth >= 0 ? "+" : ""}
                {analyticsData.revenueData.growth.toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fraud Detection</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {analyticsData.fraudDetectionStats.accuracy.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.fraudDetectionStats.totalFlagged} flagged cases
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Institutions */}
          <Card>
            <CardHeader>
              <CardTitle>Top Institutions</CardTitle>
              <CardDescription>Institutions with most verifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topInstitutions.slice(0, 5).map((institution, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{institution.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {institution.credentialCount} credentials • {institution.verificationCount} verifications
                      </p>
                    </div>
                    <Badge variant="outline">{institution.verificationCount}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Verification Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Current verification status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.verificationStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {stat.status === "verified" && <div className="w-3 h-3 bg-green-500 rounded-full" />}
                      {stat.status === "pending" && <div className="w-3 h-3 bg-yellow-500 rounded-full" />}
                      {stat.status === "failed" && <div className="w-3 h-3 bg-red-500 rounded-full" />}
                      <span className="font-medium capitalize">{stat.status}</span>
                    </div>
                    <Badge variant="outline">{Number.parseInt(stat.count).toLocaleString()}</Badge>
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
