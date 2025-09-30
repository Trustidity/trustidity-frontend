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
  Building,
  Shield,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Users,
  DollarSign,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Shield },
  { name: "User Management", href: "/dashboard/users", icon: Users },
  {
    name: "Institutions",
    href: "/dashboard/institutions",
    icon: Building,
    current: true,
  },
  { name: "Pricing", href: "/dashboard/pricing", icon: DollarSign },
  { name: "System Logs", href: "/dashboard/logs", icon: FileText },
];

interface Institution {
  id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website?: string;
  contactEmail: string;
  contactPhone?: string;
  description?: string;
  establishedYear?: number;
  createdAt: string;
  updatedAt: string;
}

interface InstitutionStats {
  totalInstitutions: number;
  activeInstitutions: number;
  universities: number;
  totalStudents: number;
  pendingApprovals: number;
}

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [institutionStats, setInstitutionStats] = useState<InstitutionStats>({
    totalInstitutions: 0,
    activeInstitutions: 0,
    universities: 0,
    totalStudents: 0,
    pendingApprovals: 0,
  });

  const [newInstitution, setNewInstitution] = useState({
    name: "",
    contactEmail: "",
    type: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    contactPhone: "",
    website: "",
    establishedYear: "",
    description: "",
  });

  const api = useApi();
  const { toast } = useToast();

  const fetchInstitutions = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.getInstitutions(
          page,
          20,
          searchQuery,
          statusFilter,
          typeFilter
        );

        if (response.success && response.data) {
          setInstitutions(response.data.institutions);
          setCurrentPage(response.data.pagination.page);
          setTotalPages(response.data.pagination.pages);

          // Calculate stats from the institutions data
          const stats = response.data.institutions.reduce(
            (acc, institution) => {
              acc.totalInstitutions++;
              if (institution.status === "active") acc.activeInstitutions++;
              if (institution.type.toLowerCase().includes("university"))
                acc.universities++;
              if (institution.status === "pending") acc.pendingApprovals++;
              return acc;
            },
            {
              totalInstitutions: 0,
              activeInstitutions: 0,
              universities: 0,
              totalStudents: 0, // This would need to come from a separate endpoint
              pendingApprovals: 0,
            }
          );
          setInstitutionStats(stats);
        } else {
          setError(response.error || "Failed to fetch institutions");
          toast({
            title: "Error",
            description: response.error || "Failed to fetch institutions",
            variant: "destructive",
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [api, searchQuery, statusFilter, typeFilter, toast]
  );

  useEffect(() => {
    fetchInstitutions(1);
  }, [fetchInstitutions]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchInstitutions(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchInstitutions]);

  const filteredInstitutions = institutions.filter((institution) => {
    const matchesSearch =
      institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.contactEmail
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      institution.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || institution.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || institution.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleInstitutionAction = async (
    institution: Institution,
    action: string
  ) => {
    setSelectedInstitution(institution);
    setActionType(action);
    setActionReason("");
    setIsActionOpen(true);
  };

  const executeInstitutionAction = async () => {
    if (!selectedInstitution || !actionType) return;

    try {
      setActionLoading(true);
      let response;

      switch (actionType) {
        case "approve":
          response = await api.approveInstitution(
            selectedInstitution.id,
            "active",
            actionReason
          );
          break;
        case "suspend":
          response = await api.approveInstitution(
            selectedInstitution.id,
            "suspended",
            actionReason
          );
          break;
        case "activate":
          response = await api.approveInstitution(
            selectedInstitution.id,
            "active",
            actionReason
          );
          break;
        case "delete":
          response = await api.deleteInstitution(selectedInstitution.id);
          break;
        default:
          throw new Error("Invalid action type");
      }

      if (response.success) {
        toast({
          title: "Success",
          description:
            response.message || `Institution ${actionType}d successfully`,
        });
        setIsActionOpen(false);
        fetchInstitutions(currentPage); // Refresh the current page
      } else {
        toast({
          title: "Error",
          description: response.error || `Failed to ${actionType} institution`,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : `Failed to ${actionType} institution`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddInstitution = async () => {
    try {
      setActionLoading(true);

      const institutionData = {
        ...newInstitution,
        establishedYear: newInstitution.establishedYear
          ? Number.parseInt(newInstitution.establishedYear)
          : undefined,
      };

      const response = await api.createInstitution(institutionData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Institution added successfully",
        });
        setIsAddOpen(false);
        setNewInstitution({
          name: "",
          contactEmail: "",
          type: "",
          address: "",
          city: "",
          state: "",
          country: "Nigeria",
          contactPhone: "",
          website: "",
          establishedYear: "",
          description: "",
        });
        fetchInstitutions(1); // Refresh to show new institution
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add institution",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to add institution",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (institution: Institution) => {
    setSelectedInstitution(institution);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Pending Approval
          </Badge>
        );
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "university":
        return (
          <Badge className="bg-purple-100 text-purple-800">University</Badge>
        );
      case "private_university":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Private University
          </Badge>
        );
      case "polytechnic":
        return (
          <Badge className="bg-green-100 text-green-800">Polytechnic</Badge>
        );
      case "college":
        return <Badge className="bg-indigo-100 text-indigo-800">College</Badge>;
      case "exam_body":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            Examination Body
          </Badge>
        );
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const institutionTypes = [
    "UNIVERSITY",
    "POLYTECHNIC",
    "COLLEGE",
    "SECONDARY_SCHOOL",
    "EXAM_BODY",
    "PROFESSIONAL_BODY",
    "GOVERNMENT_AGENCY",
  ];

  if (loading && institutions.length === 0) {
    return (
      <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
        <DashboardLayout navigation={navigation}>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error && institutions.length === 0) {
    return (
      <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
        <DashboardLayout navigation={navigation}>
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <h3 className="text-lg font-medium">Failed to load institutions</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => fetchInstitutions(1)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Institution Management
              </h1>
              <p className="text-muted-foreground">
                Manage educational institutions and examination bodies
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => fetchInstitutions(currentPage)}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Institution
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Institution</DialogTitle>
                    <DialogDescription>
                      Register a new educational institution or examination body
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Institution Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., University of Lagos"
                        value={newInstitution.name}
                        onChange={(e) =>
                          setNewInstitution({
                            ...newInstitution,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Official Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@institution.edu.ng"
                        value={newInstitution.contactEmail}
                        onChange={(e) =>
                          setNewInstitution({
                            ...newInstitution,
                            contactEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Institution Type</Label>
                      <Select
                        value={newInstitution.type}
                        onValueChange={(value) =>
                          setNewInstitution({ ...newInstitution, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {institutionTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Institution address"
                        value={newInstitution.address}
                        onChange={(e) =>
                          setNewInstitution({
                            ...newInstitution,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="e.g., Lagos"
                        value={newInstitution.city}
                        onChange={(e) =>
                          setNewInstitution({
                            ...newInstitution,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="e.g., Lagos State"
                        value={newInstitution.state}
                        onChange={(e) =>
                          setNewInstitution({
                            ...newInstitution,
                            state: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+234 xxx xxx xxxx"
                        value={newInstitution.contactPhone}
                        onChange={(e) =>
                          setNewInstitution({
                            ...newInstitution,
                            contactPhone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        placeholder="https://institution.edu.ng"
                        value={newInstitution.website}
                        onChange={(e) =>
                          setNewInstitution({
                            ...newInstitution,
                            website: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="established">Established Year</Label>
                      <Input
                        id="established"
                        placeholder="e.g., 1962"
                        value={newInstitution.establishedYear}
                        onChange={(e) =>
                          setNewInstitution({
                            ...newInstitution,
                            establishedYear: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the institution"
                        value={newInstitution.description}
                        onChange={(e) =>
                          setNewInstitution({
                            ...newInstitution,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddOpen(false)}
                      disabled={actionLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddInstitution}
                      disabled={actionLoading}
                    >
                      {actionLoading && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Add Institution
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Institutions
                </CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {institutionStats.totalInstitutions}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {institutionStats.activeInstitutions}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Universities
                </CardTitle>
                <Building className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {institutionStats.universities}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {institutionStats.totalStudents.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Approval
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {institutionStats.pendingApprovals}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Search Institutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Institution Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {institutionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Institutions List */}
          <Card>
            <CardHeader>
              <CardTitle>All Institutions</CardTitle>
              <CardDescription>
                Manage educational institutions and their access
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading institutions...
                </div>
              )}

              {!loading && (
                <div className="space-y-4">
                  {filteredInstitutions.map((institution) => (
                    <div
                      key={institution.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {institution.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-foreground">
                                {institution.name}
                              </h3>
                              {getTypeBadge(institution.type)}
                              {getStatusBadge(institution.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {institution.contactEmail}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span>
                                Location: {institution.city},{" "}
                                {institution.state}
                              </span>
                              <span>Code: {institution.code}</span>
                              {institution.establishedYear && (
                                <span>Est: {institution.establishedYear}</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                              <span>
                                Joined: {formatDate(institution.createdAt)}
                              </span>
                              <span>
                                Updated: {formatDate(institution.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(institution)}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleInstitutionAction(institution, "edit")
                            }
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          {institution.status === "pending" && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                handleInstitutionAction(institution, "approve")
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {institution.status === "active" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                              onClick={() =>
                                handleInstitutionAction(institution, "suspend")
                              }
                            >
                              Suspend
                            </Button>
                          ) : institution.status === "suspended" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700 bg-transparent"
                              onClick={() =>
                                handleInstitutionAction(institution, "activate")
                              }
                            >
                              Activate
                            </Button>
                          ) : null}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() =>
                              handleInstitutionAction(institution, "delete")
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredInstitutions.length === 0 && (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No institutions found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ||
                    typeFilter !== "all" ||
                    statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No institutions registered yet"}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchInstitutions(currentPage - 1)}
                      disabled={currentPage <= 1 || loading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchInstitutions(currentPage + 1)}
                      disabled={currentPage >= totalPages || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Institution Details Dialog */}
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Institution Details</DialogTitle>
                <DialogDescription>
                  Complete information about the institution
                </DialogDescription>
              </DialogHeader>
              {selectedInstitution && (
                <Tabs defaultValue="profile" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Institution Name</Label>
                        <p className="font-medium">
                          {selectedInstitution.name}
                        </p>
                      </div>
                      <div>
                        <Label>Institution Code</Label>
                        <p className="font-medium">
                          {selectedInstitution.code}
                        </p>
                      </div>
                      <div>
                        <Label>Institution Type</Label>
                        <div>{getTypeBadge(selectedInstitution.type)}</div>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <div>{getStatusBadge(selectedInstitution.status)}</div>
                      </div>
                      <div>
                        <Label>Country</Label>
                        <p className="font-medium">
                          {selectedInstitution.country}
                        </p>
                      </div>
                      <div>
                        <Label>Established Year</Label>
                        <p className="font-medium">
                          {selectedInstitution.establishedYear ||
                            "Not specified"}
                        </p>
                      </div>
                      {selectedInstitution.description && (
                        <div className="md:col-span-2">
                          <Label>Description</Label>
                          <p className="font-medium">
                            {selectedInstitution.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Email Address</Label>
                        <p className="font-medium">
                          {selectedInstitution.contactEmail}
                        </p>
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <p className="font-medium">
                          {selectedInstitution.contactPhone || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <Label>Website</Label>
                        <p className="font-medium text-blue-600">
                          {selectedInstitution.website || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <Label>Address</Label>
                        <p className="font-medium">
                          {selectedInstitution.address}
                        </p>
                      </div>
                      <div>
                        <Label>City</Label>
                        <p className="font-medium">
                          {selectedInstitution.city}
                        </p>
                      </div>
                      <div>
                        <Label>State</Label>
                        <p className="font-medium">
                          {selectedInstitution.state}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Registration Date</Label>
                        <p className="font-medium">
                          {formatDate(selectedInstitution.createdAt)}
                        </p>
                      </div>
                      <div>
                        <Label>Last Updated</Label>
                        <p className="font-medium">
                          {formatDate(selectedInstitution.updatedAt)}
                        </p>
                      </div>
                      <div>
                        <Label>Current Status</Label>
                        <div>{getStatusBadge(selectedInstitution.status)}</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </DialogContent>
          </Dialog>

          {/* Action Confirmation Dialog */}
          <Dialog open={isActionOpen} onOpenChange={setIsActionOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {actionType === "approve" && "Approve Institution"}
                  {actionType === "suspend" && "Suspend Institution"}
                  {actionType === "activate" && "Activate Institution"}
                  {actionType === "delete" && "Delete Institution"}
                  {actionType === "edit" && "Edit Institution"}
                </DialogTitle>
                <DialogDescription>
                  {actionType === "approve" &&
                    "This will approve the institution and grant them access to the system."}
                  {actionType === "suspend" &&
                    "This will suspend the institution's account and prevent access."}
                  {actionType === "activate" &&
                    "This will reactivate the institution's account."}
                  {actionType === "delete" &&
                    "This action cannot be undone. All institution data will be permanently deleted."}
                  {actionType === "edit" &&
                    "Modify institution details and settings."}
                </DialogDescription>
              </DialogHeader>
              {selectedInstitution && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium">{selectedInstitution.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedInstitution.contactEmail}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getTypeBadge(selectedInstitution.type)}
                      {getStatusBadge(selectedInstitution.status)}
                    </div>
                  </div>

                  {(actionType === "approve" ||
                    actionType === "suspend" ||
                    actionType === "activate") && (
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason (optional)</Label>
                      <Textarea
                        id="reason"
                        placeholder="Enter reason for this action..."
                        value={actionReason}
                        onChange={(e) => setActionReason(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsActionOpen(false)}
                      disabled={actionLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      className={
                        actionType === "delete" || actionType === "suspend"
                          ? "bg-red-600 hover:bg-red-700"
                          : actionType === "approve" ||
                            actionType === "activate"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                      onClick={executeInstitutionAction}
                      disabled={actionLoading}
                    >
                      {actionLoading && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      {actionType === "approve" && "Approve Institution"}
                      {actionType === "suspend" && "Suspend Institution"}
                      {actionType === "activate" && "Activate Institution"}
                      {actionType === "delete" && "Delete Institution"}
                      {actionType === "edit" && "Save Changes"}
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
