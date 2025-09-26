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
  Download,
  Eye,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: FileText },
  {
    name: "My Documents",
    href: "/dashboard/documents",
    icon: FileText,
    current: true,
  },
  {
    name: "Verification History",
    href: "/dashboard/history",
    icon: CheckCircle,
  },
];

const documents = [
  {
    id: "1",
    name: "Bachelor's Degree - Computer Science",
    type: "degree",
    status: "verified",
    certificateNumber: "UNN/CSC/2023/001234",
    institutionName: "University of Nigeria, Nsukka",
    graduationYear: "2023",
    requestDate: "2024-01-15",
    verificationDate: "2024-01-16",
    referenceNumber: "TRU-2024-001234",
    fileUrl: "/documents/degree-cert.pdf",
  },
  {
    id: "2",
    name: "WAEC Certificate",
    type: "waec",
    status: "pending",
    certificateNumber: "2345678901",
    institutionName: "WAEC Nigeria",
    graduationYear: "2019",
    requestDate: "2024-01-20",
    referenceNumber: "TRU-2024-001235",
    fileUrl: "/documents/waec-cert.pdf",
  },
  {
    id: "3",
    name: "JAMB Result",
    type: "jamb",
    status: "rejected",
    certificateNumber: "12345678",
    institutionName: "JAMB",
    graduationYear: "2020",
    requestDate: "2024-01-10",
    verificationDate: "2024-01-12",
    referenceNumber: "TRU-2024-001233",
    rejectionReason: "Certificate number not found in JAMB database",
    fileUrl: "/documents/jamb-result.pdf",
  },
  {
    id: "4",
    name: "Master's Degree - Data Science",
    type: "degree",
    status: "verified",
    certificateNumber: "UI/DS/2024/005678",
    institutionName: "University of Ibadan",
    graduationYear: "2024",
    requestDate: "2024-01-05",
    verificationDate: "2024-01-07",
    referenceNumber: "TRU-2024-001230",
    fileUrl: "/documents/masters-cert.pdf",
  },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.institutionName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
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
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user", "institution_admin"]}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Documents</h1>
            <p className="text-muted-foreground">
              Manage and track all your credential verification documents
            </p>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Search Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by document name, certificate number, or institution..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    onClick={() => setStatusFilter("all")}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={
                      statusFilter === "verified" ? "default" : "outline"
                    }
                    onClick={() => setStatusFilter("verified")}
                    size="sm"
                  >
                    Verified
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    onClick={() => setStatusFilter("pending")}
                    size="sm"
                  >
                    Pending
                  </Button>
                  <Button
                    variant={
                      statusFilter === "rejected" ? "default" : "outline"
                    }
                    onClick={() => setStatusFilter("rejected")}
                    size="sm"
                  >
                    Rejected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(doc.status)}
                      <div>
                        <CardTitle className="text-base">{doc.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {doc.institutionName}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Certificate No:
                      </span>
                      <span className="font-medium">
                        {doc.certificateNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year:</span>
                      <span className="font-medium">{doc.graduationYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reference:</span>
                      <span className="font-medium text-primary">
                        {doc.referenceNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requested:</span>
                      <span className="font-medium">{doc.requestDate}</span>
                    </div>
                    {doc.verificationDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Verified:</span>
                        <span className="font-medium text-green-600">
                          {doc.verificationDate}
                        </span>
                      </div>
                    )}
                  </div>

                  {doc.rejectionReason && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">
                        <strong>Rejection Reason:</strong> {doc.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No documents found
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "You haven't uploaded any documents yet"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
