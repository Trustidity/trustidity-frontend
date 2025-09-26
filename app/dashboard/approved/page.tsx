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
  Building,
  Search,
  Download,
  Eye,
  Calendar,
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
  { name: "Dashboard", href: "/dashboard", icon: Building },
  { name: "Student Records", href: "/dashboard/records", icon: FileText },
  { name: "Verification Requests", href: "/dashboard/requests", icon: Clock },
  {
    name: "Approved Documents",
    href: "/dashboard/approved",
    icon: CheckCircle,
    current: true,
  },
];

const approvedDocuments = [
  {
    id: "1",
    referenceNumber: "TRU-2024-001234",
    studentName: "Alice Johnson",
    studentId: "UNN/CSC/2023/001234",
    documentType: "Bachelor's Degree",
    program: "Computer Science",
    graduationYear: "2023",
    grade: "Second Class Upper",
    cgpa: "3.65",
    approvedDate: "2024-01-19",
    approvedBy: "Dr. Sarah Wilson",
    requestedBy: "TechCorp HR",
    requesterEmail: "hr@techcorp.com",
    certificateNumber: "UNN/CSC/2023/001234",
    verificationCount: 3,
    lastAccessed: "2024-01-25",
  },
  {
    id: "2",
    referenceNumber: "TRU-2024-001236",
    studentName: "Carol Davis",
    studentId: "UNN/MED/2021/009876",
    documentType: "PhD Certificate",
    program: "Medicine",
    graduationYear: "2021",
    grade: "First Class",
    cgpa: "4.15",
    approvedDate: "2024-01-18",
    approvedBy: "Prof. Michael Brown",
    requestedBy: "University Hospital",
    requesterEmail: "admin@unihospital.edu",
    certificateNumber: "UNN/MED/2021/009876",
    verificationCount: 1,
    lastAccessed: "2024-01-20",
  },
  {
    id: "3",
    referenceNumber: "TRU-2024-001230",
    studentName: "John Smith",
    studentId: "UNN/ENG/2022/005678",
    documentType: "Master's Degree",
    program: "Electrical Engineering",
    graduationYear: "2022",
    grade: "First Class",
    cgpa: "4.25",
    approvedDate: "2024-01-15",
    approvedBy: "Dr. Sarah Wilson",
    requestedBy: "Global Engineering Ltd",
    requesterEmail: "verify@globaleng.com",
    certificateNumber: "UNN/ENG/2022/005678",
    verificationCount: 5,
    lastAccessed: "2024-01-24",
  },
  {
    id: "4",
    referenceNumber: "TRU-2024-001228",
    studentName: "Emily Davis",
    studentId: "UNN/LAW/2023/012345",
    documentType: "Bachelor's Degree",
    program: "Law",
    graduationYear: "2023",
    grade: "Second Class Upper",
    cgpa: "3.75",
    approvedDate: "2024-01-12",
    approvedBy: "Prof. Michael Brown",
    requestedBy: "Legal Associates",
    requesterEmail: "verify@legalassoc.com",
    certificateNumber: "UNN/LAW/2023/012345",
    verificationCount: 2,
    lastAccessed: "2024-01-22",
  },
];

export default function ApprovedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredDocuments = approvedDocuments.filter((doc) => {
    const matchesSearch =
      doc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDocumentType =
      documentTypeFilter === "all" || doc.documentType === documentTypeFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const approvedDate = new Date(doc.approvedDate);
      const now = new Date();
      const daysDiff = Math.floor(
        (now.getTime() - approvedDate.getTime()) / (1000 * 60 * 60 * 24)
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

    return matchesSearch && matchesDocumentType && matchesDate;
  });

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "First Class":
        return (
          <Badge className="bg-purple-100 text-purple-800">First Class</Badge>
        );
      case "Second Class Upper":
        return <Badge className="bg-blue-100 text-blue-800">2:1</Badge>;
      case "Second Class Lower":
        return <Badge className="bg-yellow-100 text-yellow-800">2:2</Badge>;
      case "Third Class":
        return (
          <Badge className="bg-orange-100 text-orange-800">Third Class</Badge>
        );
      default:
        return <Badge variant="secondary">{grade}</Badge>;
    }
  };

  const documentTypes = [
    ...new Set(approvedDocuments.map((d) => d.documentType)),
  ];

  return (
    <ProtectedRoute allowedRoles={["institution_admin"]}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Approved Documents
            </h1>
            <p className="text-muted-foreground">
              View and manage all approved credential verifications
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Approved
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {approvedDocuments.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    approvedDocuments.filter((d) => {
                      const approvedDate = new Date(d.approvedDate);
                      const now = new Date();
                      return (
                        approvedDate.getMonth() === now.getMonth() &&
                        approvedDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Verifications
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {approvedDocuments.reduce(
                    (sum, d) => sum + d.verificationCount,
                    0
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Document Types
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documentTypes.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Search Approved Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by student name, reference number, program, or requester..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={documentTypeFilter}
                    onValueChange={setDocumentTypeFilter}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Document Types</SelectItem>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approved Documents List */}
          <Card>
            <CardHeader>
              <CardTitle>Approved Verifications</CardTitle>
              <CardDescription>
                All successfully verified and approved documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-foreground">
                              {doc.studentName}
                            </h3>
                            <Badge className="bg-green-100 text-green-800">
                              Approved
                            </Badge>
                            {getGradeBadge(doc.grade)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {doc.documentType} • {doc.program} • Class of{" "}
                            {doc.graduationYear}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-muted-foreground">
                            <div>
                              <span className="font-medium">Reference:</span>{" "}
                              {doc.referenceNumber}
                            </div>
                            <div>
                              <span className="font-medium">Student ID:</span>{" "}
                              {doc.studentId}
                            </div>
                            <div>
                              <span className="font-medium">CGPA:</span>{" "}
                              {doc.cgpa}
                            </div>
                            <div>
                              <span className="font-medium">Certificate:</span>{" "}
                              {doc.certificateNumber}
                            </div>
                            <div>
                              <span className="font-medium">Approved:</span>{" "}
                              {doc.approvedDate}
                            </div>
                            <div>
                              <span className="font-medium">Approved by:</span>{" "}
                              {doc.approvedBy}
                            </div>
                            <div>
                              <span className="font-medium">Requested by:</span>{" "}
                              {doc.requestedBy}
                            </div>
                            <div>
                              <span className="font-medium">
                                Last accessed:
                              </span>{" "}
                              {doc.lastAccessed}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 text-xs">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Verified {doc.verificationCount} time
                                {doc.verificationCount !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="text-muted-foreground">
                              Contact: {doc.requesterEmail}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Certificate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No approved documents found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ||
                    documentTypeFilter !== "all" ||
                    dateFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No documents have been approved yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Activity</CardTitle>
                <CardDescription>Recent verification trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Most Verified Document
                    </span>
                    <span className="font-medium">
                      {
                        approvedDocuments.reduce((max, doc) =>
                          doc.verificationCount > max.verificationCount
                            ? doc
                            : max
                        ).documentType
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Average Verifications per Document
                    </span>
                    <span className="font-medium">
                      {(
                        approvedDocuments.reduce(
                          (sum, d) => sum + d.verificationCount,
                          0
                        ) / approvedDocuments.length
                      ).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Most Common Grade
                    </span>
                    <span className="font-medium">Second Class Upper</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Requesters</CardTitle>
                <CardDescription>
                  Organizations with most verifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...new Set(approvedDocuments.map((d) => d.requestedBy))]
                    .map((requester) => ({
                      name: requester,
                      count: approvedDocuments.filter(
                        (d) => d.requestedBy === requester
                      ).length,
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((requester, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-muted-foreground">
                          {requester.name}
                        </span>
                        <Badge variant="outline">
                          {requester.count} verification
                          {requester.count !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
