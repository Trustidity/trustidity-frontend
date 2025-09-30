"use client";

import { DashboardLayout } from "./dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Building,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { ActivityLog } from "@/types/activity-log"; // Declare ActivityLog type

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Building, current: true },
  { name: "Student Records", href: "/dashboard/records", icon: FileText },
  { name: "Verification Requests", href: "/dashboard/requests", icon: Clock },
  {
    name: "Approved Documents",
    href: "/dashboard/approved",
    icon: CheckCircle,
  },
];

interface DashboardData {
  overview: {
    totalCredentials: number;
    activeCredentials: number;
    totalVerifications: number;
    recentVerifications: number;
  };
  trends: Array<{
    date: string;
    count: string;
  }>;
  topCredentials: Array<{
    certificateNumber: string;
    holderName: string;
    program: string;
    verificationCount: string;
  }>;
}

interface VerificationRequest {
  id: string;
  referenceNumber: string;
  status: "pending" | "approved" | "rejected";
  method: string;
  certificateNumber: string;
  holderName: string;
  institutionName: string;
  amount: string;
  currency: string;
  paymentReference: string | null;
  paymentVerified: boolean;
  verificationResult: any;
  searchCriteria: {
    holderName: string;
    certificateNumber: string;
  };
  metadata: {
    source: string;
    addedAt: string;
  };
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  credentialId: string;
  createdAt: string;
  updatedAt: string;
  credential: {
    id: string;
    certificateNumber: string;
    type: string;
    holderName: string;
    program: string;
    grade: string;
    graduationDate: string;
    issueDate: string;
    // ... other credential fields
  };
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    organization: string;
    // ... other user fields
  };
}

export function InstitutionDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [verificationRequests, setVerificationRequests] = useState<
    VerificationRequest[]
  >([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { auth } = useAuth();
  const { toast } = useToast();

  const institutionId = auth.user?.institutionId || auth.user?.id;

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("trustidity_token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const fetchDashboardData = useCallback(async () => {
    if (!institutionId) {
      setError("Institution ID not found");
      setLoading(false);
      return;
    }

    if (auth.isLoading) {
      return;
    }

    console.log("[v0] Institution ID:", institutionId);
    console.log("[v0] Auth user:", auth.user);

    try {
      setLoading(true);
      setError(null);

      const [statsResponse, requestsResponse, logsResponse] = await Promise.all(
        [
          apiCall(`/institutions/${institutionId}/dashboard`),
          apiCall(
            `/institutions/${institutionId}/verification-requests?page=1&limit=10&status=pending`
          ),
          apiCall(
            `/institutions/${institutionId}/activity-logs?page=1&limit=5`
          ),
        ]
      );

      console.log("[v0] Stats response:", statsResponse);
      console.log("[v0] Requests response:", requestsResponse);
      console.log("[v0] Logs response:", logsResponse);

      if (statsResponse.success && statsResponse.data) {
        setDashboardData(statsResponse.data);
      } else {
        console.log("[v0] Stats API failed:", statsResponse.error);
        setDashboardData({
          overview: {
            totalCredentials: 0,
            activeCredentials: 0,
            totalVerifications: 0,
            recentVerifications: 0,
          },
          trends: [],
          topCredentials: [],
        });
      }

      if (requestsResponse.success && requestsResponse.data) {
        const requests = requestsResponse.data.requests || [];
        console.log("[v0] Setting verification requests:", requests);
        setVerificationRequests(requests);
      } else {
        console.log("[v0] Requests API failed:", requestsResponse.error);
        setVerificationRequests([]);
      }

      if (logsResponse.success && logsResponse.data) {
        const logs =
          logsResponse.data.logs || logsResponse.data.activityLogs || [];
        console.log("[v0] Setting activity logs:", logs);
        setActivityLogs(logs);
      } else {
        console.log("[v0] Logs API failed:", logsResponse.error);
        setActivityLogs([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load dashboard data";
      console.error("[v0] Dashboard fetch error:", err);
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [institutionId, auth.user, auth.isLoading, toast]);

  useEffect(() => {
    if (!auth.isLoading && institutionId) {
      fetchDashboardData();
    }
  }, [auth.isLoading, institutionId, fetchDashboardData]);

  const handleApprove = async (id: string) => {
    if (!institutionId) return;

    try {
      setActionLoading(id);
      const response = await apiCall(
        `/institutions/${institutionId}/verification-requests/${id}/approve`,
        {
          method: "POST",
        }
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Verification request approved successfully",
        });
        const requestsResponse = await apiCall(
          `/institutions/${institutionId}/verification-requests?page=1&limit=10&status=pending`
        );
        if (requestsResponse.success && requestsResponse.data) {
          const requests = requestsResponse.data.requests || [];
          setVerificationRequests(requests);
        }
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to approve verification",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to approve verification",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!institutionId) return;

    try {
      setActionLoading(id);
      const response = await apiCall(
        `/institutions/${institutionId}/verification-requests/${id}/reject`,
        {
          method: "POST",
          body: JSON.stringify({ reason: "Rejected by institution admin" }),
        }
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Verification request rejected successfully",
        });
        const requestsResponse = await apiCall(
          `/institutions/${institutionId}/verification-requests?page=1&limit=10&status=pending`
        );
        if (requestsResponse.success && requestsResponse.data) {
          const requests = requestsResponse.data.requests || [];
          setVerificationRequests(requests);
        }
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to reject verification",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to reject verification",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Pending Review
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Less than an hour ago";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <DashboardLayout navigation={navigation}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading dashboard...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !institutionId) {
    return (
      <DashboardLayout navigation={navigation}>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h3 className="text-lg font-medium">Access Error</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome {auth.user?.organization || "Institution Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              Manage student records and verification requests
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Credentials
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.overview?.totalCredentials?.toLocaleString() ??
                  0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total credentials issued
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Credentials
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {dashboardData?.overview?.activeCredentials ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Verifications
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {dashboardData?.overview?.totalVerifications ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                All time verifications
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Verifications
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {dashboardData?.overview?.recentVerifications ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Verification Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Requests</CardTitle>
            <CardDescription>
              Review and approve student credential verification requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verificationRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {request.holderName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {request.credential?.type || "Document"} •{" "}
                          {request.credential?.program || "N/A"} •{" "}
                          {request.certificateNumber}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ref: {request.referenceNumber} • Requested{" "}
                          {formatDate(request.createdAt)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Amount: {request.currency} {request.amount} • Method:{" "}
                          {request.method}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(request.status)}
                    {request.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(request.id)}
                          disabled={actionLoading === request.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          {actionLoading === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Reject"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          disabled={actionLoading === request.id}
                        >
                          {actionLoading === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Approve"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {verificationRequests.length === 0 && !loading && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No pending requests
                  </h3>
                  <p className="text-muted-foreground">
                    All verification requests have been processed
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
              >
                <FileText className="mr-2 h-4 w-4" />
                Upload Student Records
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Student Database
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Bulk Approve Verifications
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {log.description || `${log.action} ${log.entityType}`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(
                        log.timestamp ||
                          log.createdAt ||
                          new Date().toISOString()
                      )}
                    </span>
                  </div>
                ))}
                {activityLogs.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
