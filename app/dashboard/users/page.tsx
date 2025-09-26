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
  Users,
  Shield,
  Search,
  Plus,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  AlertTriangle,
  DollarSign,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Shield },
  {
    name: "User Management",
    href: "/dashboard/users",
    icon: Users,
    current: true,
  },
  { name: "Institutions", href: "/dashboard/institutions", icon: Shield },
  { name: "Pricing", href: "/dashboard/pricing", icon: DollarSign },
  { name: "System Logs", href: "/dashboard/logs", icon: Shield },
];

const users = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    role: "individual",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2024-01-25",
    verificationsCount: 5,
    subscriptionPlan: "basic",
    location: "Lagos, Nigeria",
    phoneNumber: "+234 801 234 5678",
  },
  {
    id: "2",
    name: "TechCorp HR",
    email: "hr@techcorp.com",
    role: "employer",
    status: "active",
    joinDate: "2024-01-10",
    lastActive: "2024-01-24",
    verificationsCount: 127,
    subscriptionPlan: "premium",
    location: "Abuja, Nigeria",
    phoneNumber: "+234 802 345 6789",
    companySize: "500-1000 employees",
  },
  {
    id: "3",
    name: "University of Nigeria, Nsukka",
    email: "admin@unn.edu.ng",
    role: "institution",
    status: "active",
    joinDate: "2023-12-01",
    lastActive: "2024-01-25",
    verificationsCount: 2847,
    subscriptionPlan: "enterprise",
    location: "Nsukka, Nigeria",
    phoneNumber: "+234 803 456 7890",
    institutionType: "University",
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    role: "individual",
    status: "suspended",
    joinDate: "2024-01-20",
    lastActive: "2024-01-22",
    verificationsCount: 2,
    subscriptionPlan: "free",
    location: "Port Harcourt, Nigeria",
    phoneNumber: "+234 804 567 8901",
    suspensionReason: "Suspicious activity detected",
  },
  {
    id: "5",
    name: "Global Engineering Ltd",
    email: "verify@globaleng.com",
    role: "employer",
    status: "pending",
    joinDate: "2024-01-22",
    lastActive: "Never",
    verificationsCount: 0,
    subscriptionPlan: "basic",
    location: "Kano, Nigeria",
    phoneNumber: "+234 805 678 9012",
    companySize: "100-500 employees",
  },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = (user: any, action: string) => {
    setSelectedUser(user);
    setActionType(action);
    setIsActionOpen(true);
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "individual":
        return <Badge variant="outline">Individual</Badge>;
      case "employer":
        return <Badge className="bg-blue-100 text-blue-800">Employer</Badge>;
      case "institution":
        return (
          <Badge className="bg-purple-100 text-purple-800">Institution</Badge>
        );
      case "admin":
        return <Badge variant="default">Admin</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "free":
        return <Badge variant="secondary">Free</Badge>;
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

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                User Management
              </h1>
              <p className="text-muted-foreground">
                Manage all users, their roles, and access permissions
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {users.filter((u) => u.status === "active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Institutions
                </CardTitle>
                <Shield className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {users.filter((u) => u.role === "institution").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employers</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {users.filter((u) => u.role === "employer").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspended</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {users.filter((u) => u.status === "suspended").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Search Users</CardTitle>
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
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                      <SelectItem value="institution">Institution</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
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

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-foreground">
                              {user.name}
                            </h3>
                            {getRoleBadge(user.role)}
                            {getStatusBadge(user.status)}
                            {getPlanBadge(user.subscriptionPlan)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>Location: {user.location}</span>
                            <span>Joined: {user.joinDate}</span>
                            <span>Last Active: {user.lastActive}</span>
                            <span>
                              Verifications: {user.verificationsCount}
                            </span>
                          </div>
                          {user.suspensionReason && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                              <strong>Suspended:</strong>{" "}
                              {user.suspensionReason}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(user)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user, "edit")}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        {user.status === "active" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => handleUserAction(user, "suspend")}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        ) : user.status === "suspended" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700 bg-transparent"
                            onClick={() => handleUserAction(user, "activate")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activate
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleUserAction(user, "delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No users found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ||
                    roleFilter !== "all" ||
                    statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No users in the system yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Details Dialog */}
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Complete information about the user account
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <Tabs defaultValue="profile" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <p className="font-medium">{selectedUser.name}</p>
                      </div>
                      <div>
                        <Label>Email Address</Label>
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                      <div>
                        <Label>Role</Label>
                        <div>{getRoleBadge(selectedUser.role)}</div>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <div>{getStatusBadge(selectedUser.status)}</div>
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <p className="font-medium">
                          {selectedUser.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <Label>Location</Label>
                        <p className="font-medium">{selectedUser.location}</p>
                      </div>
                      {selectedUser.companySize && (
                        <div>
                          <Label>Company Size</Label>
                          <p className="font-medium">
                            {selectedUser.companySize}
                          </p>
                        </div>
                      )}
                      {selectedUser.institutionType && (
                        <div>
                          <Label>Institution Type</Label>
                          <p className="font-medium">
                            {selectedUser.institutionType}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Join Date</Label>
                        <p className="font-medium">{selectedUser.joinDate}</p>
                      </div>
                      <div>
                        <Label>Last Active</Label>
                        <p className="font-medium">{selectedUser.lastActive}</p>
                      </div>
                      <div>
                        <Label>Total Verifications</Label>
                        <p className="font-medium">
                          {selectedUser.verificationsCount}
                        </p>
                      </div>
                      <div>
                        <Label>Account Status</Label>
                        <div>{getStatusBadge(selectedUser.status)}</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="billing" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Subscription Plan</Label>
                        <div>{getPlanBadge(selectedUser.subscriptionPlan)}</div>
                      </div>
                      <div>
                        <Label>Billing Status</Label>
                        <p className="font-medium">Current</p>
                      </div>
                      <div>
                        <Label>Monthly Usage</Label>
                        <p className="font-medium">
                          {selectedUser.verificationsCount} verifications
                        </p>
                      </div>
                      <div>
                        <Label>Next Billing Date</Label>
                        <p className="font-medium">February 15, 2024</p>
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
                  {actionType === "suspend" && "Suspend User"}
                  {actionType === "activate" && "Activate User"}
                  {actionType === "delete" && "Delete User"}
                  {actionType === "edit" && "Edit User"}
                </DialogTitle>
                <DialogDescription>
                  {actionType === "suspend" &&
                    "This will suspend the user's account and prevent them from accessing the system."}
                  {actionType === "activate" &&
                    "This will reactivate the user's account and restore their access."}
                  {actionType === "delete" &&
                    "This action cannot be undone. All user data will be permanently deleted."}
                  {actionType === "edit" &&
                    "Modify user account details and permissions."}
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium">{selectedUser.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getRoleBadge(selectedUser.role)}
                      {getStatusBadge(selectedUser.status)}
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
                          : ""
                      }
                      onClick={() => {
                        console.log(`${actionType} user:`, selectedUser.id);
                        setIsActionOpen(false);
                      }}
                    >
                      {actionType === "suspend" && "Suspend User"}
                      {actionType === "activate" && "Activate User"}
                      {actionType === "delete" && "Delete User"}
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
