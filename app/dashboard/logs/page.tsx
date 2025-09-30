"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Shield,
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  Info,
  Users,
  Building,
  DollarSign,
  RefreshCw,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApi } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Shield },
  { name: "User Management", href: "/dashboard/users", icon: Users },
  { name: "Institutions", href: "/dashboard/institutions", icon: Building },
  { name: "Pricing", href: "/dashboard/pricing", icon: DollarSign },
  { name: "System Logs", href: "/dashboard/logs", icon: FileText, current: true },
]

interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId?: string
  userId?: string
  userEmail?: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  description?: string
  createdAt: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [entityTypeFilter, setEntityTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)

  const api = useApi()
  const { toast } = useToast()

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const filters: any = {}
      if (actionFilter !== "all") filters.action = actionFilter
      if (entityTypeFilter !== "all") filters.entityType = entityTypeFilter

      const response = await api.getAuditLogs(page, 50, filters)

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch audit logs")
      }

      if (!response.data) {
        throw new Error("Audit logs data is missing")
      }

      setLogs(response.data.logs)
      setTotalPages(response.data.pagination.pages)
      setTotalLogs(response.data.pagination.total)
      setCurrentPage(page)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load system logs"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs(1)
  }, [actionFilter, entityTypeFilter])

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true

    const searchLower = searchQuery.toLowerCase()
    return (
      log.description?.toLowerCase().includes(searchLower) ||
      log.userEmail?.toLowerCase().includes(searchLower) ||
      log.ipAddress?.includes(searchQuery) ||
      log.entityType.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower)
    )
  })

  const getActionBadge = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return <Badge className="bg-green-100 text-green-800">Create</Badge>
      case "update":
        return <Badge className="bg-blue-100 text-blue-800">Update</Badge>
      case "delete":
        return <Badge className="bg-red-100 text-red-800">Delete</Badge>
      case "login":
        return <Badge className="bg-purple-100 text-purple-800">Login</Badge>
      case "logout":
        return <Badge className="bg-gray-100 text-gray-800">Logout</Badge>
      case "verify":
        return <Badge className="bg-yellow-100 text-yellow-800">Verify</Badge>
      case "payment":
        return <Badge className="bg-orange-100 text-orange-800">Payment</Badge>
      default:
        return <Badge variant="secondary">{action}</Badge>
    }
  }

  const getEntityTypeBadge = (entityType: string) => {
    switch (entityType.toLowerCase()) {
      case "user":
        return <Badge variant="outline">User</Badge>
      case "institution":
        return <Badge className="bg-teal-100 text-teal-800">Institution</Badge>
      case "verification":
        return <Badge className="bg-green-100 text-green-800">Verification</Badge>
      case "systemsettings":
        return <Badge className="bg-purple-100 text-purple-800">System</Badge>
      case "credential":
        return <Badge className="bg-blue-100 text-blue-800">Credential</Badge>
      default:
        return <Badge variant="secondary">{entityType}</Badge>
    }
  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "update":
        return <Info className="h-4 w-4 text-blue-600" />
      case "delete":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "login":
      case "logout":
        return <Shield className="h-4 w-4 text-purple-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const uniqueActions = [...new Set(logs.map((log) => log.action))]
  const uniqueEntityTypes = [...new Set(logs.map((log) => log.entityType))]

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">System Logs</h1>
              <p className="text-muted-foreground">Monitor system activities, security events, and application logs</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => fetchLogs(currentPage)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLogs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Create Actions</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {logs.filter((log) => log.action.toLowerCase() === "create").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Updates</CardTitle>
                <Info className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {logs.filter((log) => log.action.toLowerCase() === "update").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Events</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {logs.filter((log) => ["login", "logout"].includes(log.action.toLowerCase())).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by description, email, IP address, or entity type..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {uniqueActions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action.charAt(0).toUpperCase() + action.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Entity Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {uniqueEntityTypes.map((entityType) => (
                        <SelectItem key={entityType} value={entityType}>
                          {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs List */}
          <Card>
            <CardHeader>
              <CardTitle>System Activity Logs</CardTitle>
              <CardDescription>Real-time system events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="flex items-start space-x-4">
                        <div className="w-4 h-4 bg-muted rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Failed to Load Logs</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={() => fetchLogs(currentPage)}>Try Again</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {getActionIcon(log.action)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium text-foreground">
                                {log.description || `${log.action} ${log.entityType}`}
                              </h3>
                              {getActionBadge(log.action)}
                              {getEntityTypeBadge(log.entityType)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-muted-foreground">
                              <div>
                                <span className="font-medium">Timestamp:</span> {formatTimestamp(log.createdAt)}
                              </div>
                              {log.userEmail && (
                                <div>
                                  <span className="font-medium">User:</span> {log.userEmail}
                                </div>
                              )}
                              {log.ipAddress && (
                                <div>
                                  <span className="font-medium">IP Address:</span> {log.ipAddress}
                                </div>
                              )}
                              {log.entityId && (
                                <div>
                                  <span className="font-medium">Entity ID:</span> {log.entityId}
                                </div>
                              )}
                            </div>
                            {log.userAgent && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                <span className="font-medium">User Agent:</span> {log.userAgent}
                              </div>
                            )}
                            {(log.oldValues || log.newValues) && (
                              <div className="mt-2 p-2 bg-muted rounded text-sm">
                                {log.oldValues && (
                                  <div className="mb-1">
                                    <strong>Old:</strong> {JSON.stringify(log.oldValues, null, 2)}
                                  </div>
                                )}
                                {log.newValues && (
                                  <div>
                                    <strong>New:</strong> {JSON.stringify(log.newValues, null, 2)}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && filteredLogs.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No logs found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || actionFilter !== "all" || entityTypeFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No system logs available"}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * 50 + 1} to {Math.min(currentPage * 50, totalLogs)} of {totalLogs} logs
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchLogs(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchLogs(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
