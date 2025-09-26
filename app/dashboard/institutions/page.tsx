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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const institutions = [
  {
    id: "1",
    name: "University of Nigeria, Nsukka",
    email: "admin@unn.edu.ng",
    type: "University",
    status: "active",
    joinDate: "2023-12-01",
    lastActive: "2024-01-25",
    studentsCount: 2847,
    verificationsCount: 1234,
    subscriptionPlan: "enterprise",
    location: "Nsukka, Enugu State",
    phoneNumber: "+234 803 456 7890",
    website: "https://unn.edu.ng",
    accreditation: "NUC Accredited",
    establishedYear: "1960",
  },
  {
    id: "2",
    name: "University of Lagos",
    email: "registry@unilag.edu.ng",
    type: "University",
    status: "active",
    joinDate: "2024-01-05",
    lastActive: "2024-01-24",
    studentsCount: 3521,
    verificationsCount: 892,
    subscriptionPlan: "enterprise",
    location: "Lagos State",
    phoneNumber: "+234 801 234 5678",
    website: "https://unilag.edu.ng",
    accreditation: "NUC Accredited",
    establishedYear: "1962",
  },
  {
    id: "3",
    name: "WAEC Nigeria",
    email: "info@waecnigeria.org",
    type: "Examination Body",
    status: "active",
    joinDate: "2023-11-15",
    lastActive: "2024-01-25",
    studentsCount: 125000,
    verificationsCount: 45678,
    subscriptionPlan: "enterprise",
    location: "Lagos State",
    phoneNumber: "+234 802 345 6789",
    website: "https://waecnigeria.org",
    accreditation: "Federal Ministry of Education",
    establishedYear: "1952",
  },
  {
    id: "4",
    name: "Covenant University",
    email: "registry@covenantuniversity.edu.ng",
    type: "Private University",
    status: "pending",
    joinDate: "2024-01-20",
    lastActive: "2024-01-22",
    studentsCount: 1250,
    verificationsCount: 0,
    subscriptionPlan: "premium",
    location: "Ota, Ogun State",
    phoneNumber: "+234 804 567 8901",
    website: "https://covenantuniversity.edu.ng",
    accreditation: "NUC Accredited",
    establishedYear: "2002",
  },
  {
    id: "5",
    name: "Lagos State Polytechnic",
    email: "admin@laspotech.edu.ng",
    type: "Polytechnic",
    status: "suspended",
    joinDate: "2024-01-10",
    lastActive: "2024-01-15",
    studentsCount: 890,
    verificationsCount: 45,
    subscriptionPlan: "basic",
    location: "Ikorodu, Lagos State",
    phoneNumber: "+234 805 678 9012",
    website: "https://laspotech.edu.ng",
    accreditation: "NBTE Accredited",
    establishedYear: "1977",
    suspensionReason: "Incomplete verification process",
  },
];

export default function InstitutionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredInstitutions = institutions.filter((institution) => {
    const matchesSearch =
      institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || institution.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || institution.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleInstitutionAction = (institution: any, action: string) => {
    setSelectedInstitution(institution);
    setActionType(action);
    setIsActionOpen(true);
  };

  const handleViewDetails = (institution: any) => {
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
    switch (type) {
      case "University":
        return (
          <Badge className="bg-purple-100 text-purple-800">University</Badge>
        );
      case "Private University":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Private University
          </Badge>
        );
      case "Polytechnic":
        return (
          <Badge className="bg-green-100 text-green-800">Polytechnic</Badge>
        );
      case "Examination Body":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            Examination Body
          </Badge>
        );
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "basic":
        return <Badge variant="outline">Basic</Badge>;
      case "premium":
        return <Badge className="bg-blue-100 text-blue-800">Premium</Badge>;
      case "enterprise":
        return (
          <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>
        );
      default:
        return <Badge variant="secondary">{plan}</Badge>;
    }
  };

  const institutionTypes = [...new Set(institutions.map((i) => i.type))];

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
                    <Input id="name" placeholder="e.g., University of Lagos" />
                  </div>
                  <div>
                    <Label htmlFor="email">Official Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@institution.edu.ng"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Institution Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="University">University</SelectItem>
                        <SelectItem value="Private University">
                          Private University
                        </SelectItem>
                        <SelectItem value="Polytechnic">Polytechnic</SelectItem>
                        <SelectItem value="College of Education">
                          College of Education
                        </SelectItem>
                        <SelectItem value="Examination Body">
                          Examination Body
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., Lagos State" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+234 xxx xxx xxxx" />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://institution.edu.ng"
                    />
                  </div>
                  <div>
                    <Label htmlFor="established">Established Year</Label>
                    <Input id="established" placeholder="e.g., 1962" />
                  </div>
                  <div>
                    <Label htmlFor="accreditation">Accreditation</Label>
                    <Input
                      id="accreditation"
                      placeholder="e.g., NUC Accredited"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddOpen(false)}>
                    Add Institution
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                <div className="text-2xl font-bold">{institutions.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {institutions.filter((i) => i.status === "active").length}
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
                  {
                    institutions.filter((i) => i.type.includes("University"))
                      .length
                  }
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
                  {institutions
                    .reduce((sum, i) => sum + i.studentsCount, 0)
                    .toLocaleString()}
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
                  {institutions.filter((i) => i.status === "pending").length}
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
                          {type}
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
                            {getPlanBadge(institution.subscriptionPlan)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {institution.email}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>Location: {institution.location}</span>
                            <span>
                              Established: {institution.establishedYear}
                            </span>
                            <span>
                              Students:{" "}
                              {institution.studentsCount.toLocaleString()}
                            </span>
                            <span>
                              Verifications:{" "}
                              {institution.verificationsCount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                            <span>Joined: {institution.joinDate}</span>
                            <span>Last Active: {institution.lastActive}</span>
                            <span>
                              Accreditation: {institution.accreditation}
                            </span>
                          </div>
                          {institution.suspensionReason && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                              <strong>Suspended:</strong>{" "}
                              {institution.suspensionReason}
                            </div>
                          )}
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

              {filteredInstitutions.length === 0 && (
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
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
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
                        <Label>Email Address</Label>
                        <p className="font-medium">
                          {selectedInstitution.email}
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
                        <Label>Phone Number</Label>
                        <p className="font-medium">
                          {selectedInstitution.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <Label>Location</Label>
                        <p className="font-medium">
                          {selectedInstitution.location}
                        </p>
                      </div>
                      <div>
                        <Label>Website</Label>
                        <p className="font-medium text-blue-600">
                          {selectedInstitution.website}
                        </p>
                      </div>
                      <div>
                        <Label>Established Year</Label>
                        <p className="font-medium">
                          {selectedInstitution.establishedYear}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <Label>Accreditation</Label>
                        <p className="font-medium">
                          {selectedInstitution.accreditation}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="statistics" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Total Students</Label>
                        <p className="font-medium text-2xl">
                          {selectedInstitution.studentsCount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label>Total Verifications</Label>
                        <p className="font-medium text-2xl">
                          {selectedInstitution.verificationsCount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label>Join Date</Label>
                        <p className="font-medium">
                          {selectedInstitution.joinDate}
                        </p>
                      </div>
                      <div>
                        <Label>Last Active</Label>
                        <p className="font-medium">
                          {selectedInstitution.lastActive}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="billing" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Subscription Plan</Label>
                        <div>
                          {getPlanBadge(selectedInstitution.subscriptionPlan)}
                        </div>
                      </div>
                      <div>
                        <Label>Billing Status</Label>
                        <p className="font-medium">Current</p>
                      </div>
                      <div>
                        <Label>Monthly Usage</Label>
                        <p className="font-medium">
                          {selectedInstitution.verificationsCount} verifications
                        </p>
                      </div>
                      <div>
                        <Label>Next Billing Date</Label>
                        <p className="font-medium">February 15, 2024</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm font-medium">
                          Recent verification approved
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm font-medium">
                          Student record updated
                        </p>
                        <p className="text-xs text-muted-foreground">
                          1 day ago
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm font-medium">
                          Bulk student upload completed
                        </p>
                        <p className="text-xs text-muted-foreground">
                          3 days ago
                        </p>
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
                      {selectedInstitution.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getTypeBadge(selectedInstitution.type)}
                      {getStatusBadge(selectedInstitution.status)}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsActionOpen(false)}
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
                      onClick={() => {
                        console.log(
                          `${actionType} institution:`,
                          selectedInstitution.id
                        );
                        setIsActionOpen(false);
                      }}
                    >
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
