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
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Calendar,
  Filter,
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
  { name: "Dashboard", href: "/dashboard", icon: FileText },
  { name: "My Documents", href: "/dashboard/documents", icon: FileText },
  {
    name: "Verification History",
    href: "/dashboard/history",
    icon: CheckCircle,
    current: true,
  },
];

const verificationHistory = [
  {
    id: "1",
    documentName: "Bachelor's Degree - Computer Science",
    certificateNumber: "UNN/CSC/2023/001234",
    institutionName: "University of Nigeria, Nsukka",
    referenceNumber: "TRU-2024-001234",
    status: "verified",
    requestDate: "2024-01-15",
    verificationDate: "2024-01-16",
    verifiedBy: "Institution Admin",
    processingTime: "1 day",
  },
  {
    id: "2",
    documentName: "Master's Degree - Data Science",
    certificateNumber: "UI/DS/2024/005678",
    institutionName: "University of Ibadan",
    referenceNumber: "TRU-2024-001230",
    status: "verified",
    requestDate: "2024-01-05",
    verificationDate: "2024-01-07",
    verifiedBy: "Institution Admin",
    processingTime: "2 days",
  },
  {
    id: "3",
    documentName: "JAMB Result",
    certificateNumber: "12345678",
    institutionName: "JAMB",
    referenceNumber: "TRU-2024-001233",
    status: "rejected",
    requestDate: "2024-01-10",
    verificationDate: "2024-01-12",
    verifiedBy: "System Admin",
    processingTime: "2 days",
    rejectionReason: "Certificate number not found in JAMB database",
  },
  {
    id: "4",
    documentName: "WAEC Certificate",
    certificateNumber: "2345678901",
    institutionName: "WAEC Nigeria",
    referenceNumber: "TRU-2024-001235",
    status: "pending",
    requestDate: "2024-01-20",
    processingTime: "5 days (ongoing)",
  },
  {
    id: "5",
    documentName: "NECO Certificate",
    certificateNumber: "3456789012",
    institutionName: "NECO",
    referenceNumber: "TRU-2024-001240",
    status: "verified",
    requestDate: "2023-12-15",
    verificationDate: "2023-12-17",
    verifiedBy: "Institution Admin",
    processingTime: "2 days",
  },
];

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredHistory = verificationHistory.filter((item) => {
    const matchesSearch =
      item.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.certificateNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const requestDate = new Date(item.requestDate);
      const now = new Date();
      const daysDiff = Math.floor(
        (now.getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      switch (dateFilter) {
        case "7days":
          matchesDate = daysDiff <= 7;
          break;
        case "30days":
          matchesDate = daysDiff <= 30;
          break;
        case "90days":
          matchesDate = daysDiff <= 90;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Verification History
            </h1>
            <p className="text-muted-foreground">
              Complete history of all your credential verification requests
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Requests
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {verificationHistory.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {
                    verificationHistory.filter((h) => h.status === "verified")
                      .length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    verificationHistory.filter((h) => h.status === "pending")
                      .length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Success Rate
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (verificationHistory.filter((h) => h.status === "verified")
                      .length /
                      verificationHistory.length) *
                      100
                  )}
                  %
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Filter History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by document, certificate number, institution, or reference..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-32">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History List */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Timeline</CardTitle>
              <CardDescription>
                Chronological list of all verification activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {getStatusIcon(item.status)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground">
                            {item.documentName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.institutionName} • Certificate:{" "}
                            {item.certificateNumber}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-2 text-xs text-muted-foreground">
                            <div>
                              <span className="font-medium">Reference:</span>{" "}
                              {item.referenceNumber}
                            </div>
                            <div>
                              <span className="font-medium">Requested:</span>{" "}
                              {item.requestDate}
                            </div>
                            {item.verificationDate && (
                              <div>
                                <span className="font-medium">Verified:</span>{" "}
                                {item.verificationDate}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Processing:</span>{" "}
                              {item.processingTime}
                            </div>
                            {item.verifiedBy && (
                              <div className="md:col-span-2">
                                <span className="font-medium">
                                  Verified by:
                                </span>{" "}
                                {item.verifiedBy}
                              </div>
                            )}
                          </div>
                          {item.rejectionReason && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                              <strong>Rejection Reason:</strong>{" "}
                              {item.rejectionReason}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {getStatusBadge(item.status)}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredHistory.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No history found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ||
                    statusFilter !== "all" ||
                    dateFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "You haven't made any verification requests yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
