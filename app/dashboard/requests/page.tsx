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
import { Label } from "@/components/ui/label";
import {
  FileText,
  CheckCircle,
  Clock,
  Building,
  Search,
  AlertCircle,
  Eye,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Building },
  { name: "Student Records", href: "/dashboard/records", icon: FileText },
  {
    name: "Verification Requests",
    href: "/dashboard/requests",
    icon: Clock,
    current: true,
  },
  {
    name: "Approved Documents",
    href: "/dashboard/approved",
    icon: CheckCircle,
  },
];

const verificationRequests = [
  {
    id: "1",
    referenceNumber: "TRU-2024-001234",
    studentName: "Alice Johnson",
    studentId: "UNN/CSC/2023/001234",
    documentType: "Bachelor's Degree",
    program: "Computer Science",
    graduationYear: "2023",
    requestDate: "2024-01-20",
    requestedBy: "TechCorp HR",
    requesterEmail: "hr@techcorp.com",
    status: "pending",
    priority: "normal",
    certificateNumber: "UNN/CSC/2023/001234",
    notes: "Urgent verification needed for job application",
  },
  {
    id: "2",
    referenceNumber: "TRU-2024-001235",
    studentName: "Bob Smith",
    studentId: "UNN/ENG/2022/005678",
    documentType: "Master's Transcript",
    program: "Electrical Engineering",
    graduationYear: "2022",
    requestDate: "2024-01-19",
    requestedBy: "Global Engineering Ltd",
    requesterEmail: "verify@globaleng.com",
    status: "under_review",
    priority: "high",
    certificateNumber: "UNN/ENG/2022/005678",
    notes: "Client requires detailed transcript with course grades",
  },
  {
    id: "3",
    referenceNumber: "TRU-2024-001236",
    studentName: "Carol Davis",
    studentId: "UNN/MED/2021/009876",
    documentType: "PhD Certificate",
    program: "Medicine",
    graduationYear: "2021",
    requestDate: "2024-01-18",
    requestedBy: "University Hospital",
    requesterEmail: "admin@unihospital.edu",
    status: "approved",
    priority: "normal",
    certificateNumber: "UNN/MED/2021/009876",
    approvedDate: "2024-01-19",
    approvedBy: "Dr. Sarah Wilson",
  },
  {
    id: "4",
    referenceNumber: "TRU-2024-001237",
    studentName: "David Wilson",
    studentId: "UNN/LAW/2023/012345",
    documentType: "Bachelor's Degree",
    program: "Law",
    graduationYear: "2023",
    requestDate: "2024-01-17",
    requestedBy: "Legal Associates",
    requesterEmail: "verify@legalassoc.com",
    status: "rejected",
    priority: "normal",
    certificateNumber: "UNN/LAW/2023/012345",
    rejectedDate: "2024-01-18",
    rejectedBy: "Prof. Michael Brown",
    rejectionReason: "Student record shows incomplete coursework",
  },
];

export default function RequestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");

  const filteredRequests = verificationRequests.filter((request) => {
    const matchesSearch =
      request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.referenceNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      request.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleReview = (request: any, action: string) => {
    setSelectedRequest(request);
    setReviewAction(action);
    setIsReviewOpen(true);
  };

  const handleSubmitReview = () => {
    console.log(
      `${reviewAction} request:`,
      selectedRequest.id,
      "Notes:",
      reviewNotes
    );
    setIsReviewOpen(false);
    setSelectedRequest(null);
    setReviewAction("");
    setReviewNotes("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Pending Review
          </Badge>
        );
      case "under_review":
        return (
          <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
        );
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "normal":
        return <Badge variant="outline">Normal</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "under_review":
        return <Eye className="h-4 w-4 text-blue-600" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <ProtectedRoute
      allowedRoles={["institution_admin", "admin", "super_admin"]}
    >
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Verification Requests
            </h1>
            <p className="text-muted-foreground">
              Review and process credential verification requests from employers
              and organizations
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
                  {verificationRequests.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Review
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    verificationRequests.filter(
                      (r) =>
                        r.status === "pending" || r.status === "under_review"
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {
                    verificationRequests.filter((r) => r.status === "approved")
                      .length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  High Priority
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {
                    verificationRequests.filter((r) => r.priority === "high")
                      .length
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by student name, reference number, student ID, or requester..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={priorityFilter}
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requests List */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Requests</CardTitle>
              <CardDescription>
                Review and approve student credential verification requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {getStatusIcon(request.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-foreground">
                              {request.studentName}
                            </h3>
                            {getStatusBadge(request.status)}
                            {getPriorityBadge(request.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {request.documentType} • {request.program} • Class
                            of {request.graduationYear}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-muted-foreground">
                            <div>
                              <span className="font-medium">Reference:</span>{" "}
                              {request.referenceNumber}
                            </div>
                            <div>
                              <span className="font-medium">Student ID:</span>{" "}
                              {request.studentId}
                            </div>
                            <div>
                              <span className="font-medium">Requested:</span>{" "}
                              {request.requestDate}
                            </div>
                            <div>
                              <span className="font-medium">Requester:</span>{" "}
                              {request.requestedBy}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span>{" "}
                              {request.requesterEmail}
                            </div>
                            <div>
                              <span className="font-medium">Certificate:</span>{" "}
                              {request.certificateNumber}
                            </div>
                          </div>
                          {request.notes && (
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                              <div className="flex items-start space-x-2">
                                <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                                <div>
                                  <strong className="text-blue-800">
                                    Notes:
                                  </strong>
                                  <p className="text-blue-700">
                                    {request.notes}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {request.rejectionReason && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                              <strong>Rejection Reason:</strong>{" "}
                              {request.rejectionReason}
                            </div>
                          )}
                          {request.approvedDate && (
                            <div className="mt-2 text-xs text-green-600">
                              Approved on {request.approvedDate} by{" "}
                              {request.approvedBy}
                            </div>
                          )}
                          {request.rejectedDate && (
                            <div className="mt-2 text-xs text-red-600">
                              Rejected on {request.rejectedDate} by{" "}
                              {request.rejectedBy}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {(request.status === "pending" ||
                          request.status === "under_review") && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                              onClick={() => handleReview(request, "reject")}
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReview(request, "approve")}
                            >
                              Approve
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No requests found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ||
                    statusFilter !== "all" ||
                    priorityFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No verification requests at the moment"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Review Dialog */}
          <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {reviewAction === "approve" ? "Approve" : "Reject"}{" "}
                  Verification Request
                </DialogTitle>
                <DialogDescription>
                  {reviewAction === "approve"
                    ? "Confirm that the student's credentials are accurate and approve this verification request."
                    : "Provide a reason for rejecting this verification request."}
                </DialogDescription>
              </DialogHeader>
              {selectedRequest && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">
                      {selectedRequest.studentName}
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Document: {selectedRequest.documentType}</p>
                      <p>Program: {selectedRequest.program}</p>
                      <p>Student ID: {selectedRequest.studentId}</p>
                      <p>Reference: {selectedRequest.referenceNumber}</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="review-notes">
                      {reviewAction === "approve"
                        ? "Additional Notes (Optional)"
                        : "Rejection Reason"}
                    </Label>
                    <Textarea
                      id="review-notes"
                      placeholder={
                        reviewAction === "approve"
                          ? "Add any additional notes about this verification..."
                          : "Please provide a clear reason for rejection..."
                      }
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsReviewOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitReview}
                      className={
                        reviewAction === "reject"
                          ? "bg-red-600 hover:bg-red-700"
                          : ""
                      }
                      disabled={
                        reviewAction === "reject" && !reviewNotes.trim()
                      }
                    >
                      {reviewAction === "approve"
                        ? "Approve Request"
                        : "Reject Request"}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
