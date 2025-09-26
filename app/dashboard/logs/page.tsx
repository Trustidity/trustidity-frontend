"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Shield },
  { name: "User Management", href: "/dashboard/users", icon: Users },
  { name: "Institutions", href: "/dashboard/institutions", icon: Building },
  { name: "Pricing", href: "/dashboard/pricing", icon: DollarSign },
  {
    name: "System Logs",
    href: "/dashboard/logs",
    icon: FileText,
    current: true,
  },
];

const systemLogs = [
  {
    id: "1",
    timestamp: "2024-01-25 14:30:25",
    level: "info",
    category: "authentication",
    message: "User login successful",
    details:
      "User john.smith@email.com logged in successfully from IP 192.168.1.100",
    userId: "user_123",
    userEmail: "john.smith@email.com",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "2",
    timestamp: "2024-01-25 14:28:15",
    level: "warning",
    category: "verification",
    message: "Multiple verification attempts detected",
    details:
      "User attempted to verify the same document 5 times within 10 minutes",
    userId: "user_456",
    userEmail: "suspicious@email.com",
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G975F)",
  },
  {
    id: "3",
    timestamp: "2024-01-25 14:25:10",
    level: "error",
    category: "system",
    message: "Database connection timeout",
    details:
      "Connection to primary database timed out after 30 seconds. Failover to secondary database initiated.",
    ipAddress: "10.0.0.1",
    errorCode: "DB_TIMEOUT_001",
  },
  {
    id: "4",
    timestamp: "2024-01-25 14:20:45",
    level: "info",
    category: "verification",
    message: "Document verification completed",
    details:
      "Bachelor's degree verification completed for student Alice Johnson",
    userId: "inst_789",
    userEmail: "admin@unn.edu.ng",
    referenceNumber: "TRU-2024-001234",
    documentType: "Bachelor's Degree",
  },
  {
    id: "5",
    timestamp: "2024-01-25 14:18:30",
    level: "warning",
    category: "security",
    message: "Failed login attempt",
    details: "Multiple failed login attempts detected from IP address",
    ipAddress: "198.51.100.42",
    attemptCount: 5,
    userAgent: "curl/7.68.0",
  },
  {
    id: "6",
    timestamp: "2024-01-25 14:15:20",
    level: "info",
    category: "admin",
    message: "User account suspended",
    details: "Admin suspended user account due to suspicious activity",
    adminId: "admin_001",
    adminEmail: "admin@trustidity.com",
    targetUserId: "user_789",
    targetUserEmail: "suspicious.user@email.com",
    reason: "Suspicious verification patterns detected",
  },
  {
    id: "7",
    timestamp: "2024-01-25 14:12:15",
    level: "error",
    category: "payment",
    message: "Payment processing failed",
    details: "Credit card payment failed for subscription renewal",
    userId: "user_321",
    userEmail: "customer@company.com",
    amount: "₦50,000",
    errorCode: "PAYMENT_DECLINED",
  },
  {
    id: "8",
    timestamp: "2024-01-25 14:10:05",
    level: "info",
    category: "institution",
    message: "New institution registered",
    details: "New institution completed registration process",
    institutionName: "Lagos State University",
    institutionEmail: "admin@lasu.edu.ng",
    institutionType: "University",
  },
];

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const filteredLogs = systemLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.userEmail &&
        log.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.ipAddress && log.ipAddress.includes(searchQuery));

    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesCategory =
      categoryFilter === "all" || log.category === categoryFilter;

    let matchesTime = true;
    if (timeFilter !== "all") {
      const logTime = new Date(log.timestamp);
      const now = new Date();
      const hoursDiff = Math.floor(
        (now.getTime() - logTime.getTime()) / (1000 * 60 * 60)
      );

      switch (timeFilter) {
        case "1hour":
          matchesTime = hoursDiff <= 1;
          break;
        case "24hours":
          matchesTime = hoursDiff <= 24;
          break;
        case "7days":
          matchesTime = hoursDiff <= 168; // 7 * 24
          break;
      }
    }

    return matchesSearch && matchesLevel && matchesCategory && matchesTime;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "info":
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case "debug":
        return <Badge className="bg-gray-100 text-gray-800">Debug</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "authentication":
        return <Badge variant="outline">Authentication</Badge>;
      case "verification":
        return (
          <Badge className="bg-green-100 text-green-800">Verification</Badge>
        );
      case "system":
        return <Badge className="bg-purple-100 text-purple-800">System</Badge>;
      case "security":
        return <Badge className="bg-red-100 text-red-800">Security</Badge>;
      case "admin":
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
      case "payment":
        return <Badge className="bg-orange-100 text-orange-800">Payment</Badge>;
      case "institution":
        return <Badge className="bg-teal-100 text-teal-800">Institution</Badge>;
      default:
        return <Badge variant="secondary">{category}</Badge>;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "debug":
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const categories = [...new Set(systemLogs.map((log) => log.category))];

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                System Logs
              </h1>
              <p className="text-muted-foreground">
                Monitor system activities, security events, and application logs
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
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
                <CardTitle className="text-sm font-medium">
                  Total Logs (24h)
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemLogs.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Errors</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {systemLogs.filter((log) => log.level === "error").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Warnings</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {systemLogs.filter((log) => log.level === "warning").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Security Events
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    systemLogs.filter((log) => log.category === "security")
                      .length
                  }
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
                      placeholder="Search by message, email, IP address, or details..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="1hour">Last Hour</SelectItem>
                      <SelectItem value="24hours">Last 24 Hours</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
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
              <CardDescription>
                Real-time system events and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {getLevelIcon(log.level)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-foreground">
                              {log.message}
                            </h3>
                            {getLevelBadge(log.level)}
                            {getCategoryBadge(log.category)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {log.details}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-muted-foreground">
                            <div>
                              <span className="font-medium">Timestamp:</span>{" "}
                              {log.timestamp}
                            </div>
                            {log.userEmail && (
                              <div>
                                <span className="font-medium">User:</span>{" "}
                                {log.userEmail}
                              </div>
                            )}
                            {log.ipAddress && (
                              <div>
                                <span className="font-medium">IP Address:</span>{" "}
                                {log.ipAddress}
                              </div>
                            )}
                            {log.referenceNumber && (
                              <div>
                                <span className="font-medium">Reference:</span>{" "}
                                {log.referenceNumber}
                              </div>
                            )}
                            {log.errorCode && (
                              <div>
                                <span className="font-medium">Error Code:</span>{" "}
                                {log.errorCode}
                              </div>
                            )}
                            {log.amount && (
                              <div>
                                <span className="font-medium">Amount:</span>{" "}
                                {log.amount}
                              </div>
                            )}
                            {log.institutionName && (
                              <div>
                                <span className="font-medium">
                                  Institution:
                                </span>{" "}
                                {log.institutionName}
                              </div>
                            )}
                            {log.attemptCount && (
                              <div>
                                <span className="font-medium">Attempts:</span>{" "}
                                {log.attemptCount}
                              </div>
                            )}
                          </div>
                          {log.userAgent && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <span className="font-medium">User Agent:</span>{" "}
                              {log.userAgent}
                            </div>
                          )}
                          {log.reason && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                              <strong>Reason:</strong> {log.reason}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredLogs.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No logs found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ||
                    levelFilter !== "all" ||
                    categoryFilter !== "all" ||
                    timeFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No system logs available"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Log Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Log Volume</CardTitle>
                <CardDescription>
                  Total number of logs over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder for log volume chart */}
                <div className="h-40 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                  Log Volume Chart
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Log Distribution</CardTitle>
                <CardDescription>Distribution of log levels</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder for log distribution chart */}
                <div className="h-40 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                  Log Distribution Chart
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
