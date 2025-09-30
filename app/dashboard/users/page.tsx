// app/dashboard/users/page.tsx or similar file path
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
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useUserApi } from "@/hooks/use-user-api";
import { useToast } from "@/hooks/use-toast";

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

// interface User {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: string;
//   status: string;
//   emailVerified: boolean;
//   organization?: string;
//   country?: string;
//   lastLoginAt?: string;
//   createdAt: string;
// }

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  organization?: string;
  role: "user" | "institution_admin" | "employer" | "super_admin";
  status: "active" | "inactive" | "suspended";
  emailVerified: boolean;
  country?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  institutions: number;
  employers: number;
  suspended: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    institutions: 0,
    employers: 0,
    suspended: 0,
  });

  const userApi = useUserApi();
  const { toast } = useToast();
  const isFetching = useRef(false); // Track ongoing requests
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null); // Store debounce timeout

  const fetchUsers = useCallback(
    async (
      page = 1,
      search = "",
      role = "all",
      status = "all",
      retryCount = 0
    ) => {
      if (isFetching.current) return; // Prevent concurrent requests
      isFetching.current = true;

      try {
        setLoading(true);
        setError(null);

        const response = await userApi.getUsers(
          page,
          20,
          search || undefined,
          role !== "all" ? role : undefined,
          status !== "all" ? status : undefined
        );

        if (response.success && response.data) {
          setUsers(response.data.users);
          setCurrentPage(response.data.pagination.page);
          setTotalPages(response.data.pagination.pages);

          const stats = response.data.users.reduce(
            (acc, user) => {
              acc.totalUsers++;
              if (user.status === "active") acc.activeUsers++;
              if (user.role === "institution_admin") acc.institutions++;
              if (user.role === "employer") acc.employers++;
              if (user.status === "suspended") acc.suspended++;
              return acc;
            },
            {
              totalUsers: 0,
              activeUsers: 0,
              institutions: 0,
              employers: 0,
              suspended: 0,
            }
          );
          setUserStats(stats);
        } else if (
          response.error?.includes("429") &&
          retryCount < 3 // Limit retries
        ) {
          // Handle 429 error with exponential backoff
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchUsers(page, search, role, status, retryCount + 1);
        } else {
          setError(response.error || "Failed to fetch users");
          toast({
            title: "Error",
            description: response.error || "Failed to fetch users",
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
        isFetching.current = false;
      }
    },
    [userApi, toast]
  );

  // Consolidated useEffect for initial load and filter changes
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // Clear previous timeout
    }

    debounceTimeout.current = setTimeout(() => {
      fetchUsers(1, searchQuery, roleFilter, statusFilter);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current); // Cleanup on unmount
      }
    };
  }, [searchQuery, roleFilter, statusFilter, fetchUsers]);

  const displayUsers = users;

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleUserAction = (user: User, action: string) => {
    setSelectedUser(user);
    setActionType(action);
    setIsActionOpen(true);
  };

  const executeUserAction = async () => {
    if (!selectedUser || !actionType) return;

    setActionLoading(true);

    try {
      let response;
      switch (actionType) {
        case "suspend":
          response = await userApi.suspendUser(selectedUser.id, actionReason);
          break;
        case "activate":
          response = await userApi.activateUser(selectedUser.id);
          break;
        case "delete":
          response = await userApi.deleteUser(selectedUser.id);
          break;
        case "edit":
          response = await userApi.editUser(selectedUser.id, {
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName,
            email: selectedUser.email,
            role: selectedUser.role,
            status: selectedUser.status,
            organization: selectedUser.organization,
            country: selectedUser.country,
          });
          break;
        default:
          return;
      }

      if (response.success) {
        toast({
          title: "Success",
          description: `User ${actionType}ed successfully`,
          variant: "default",
        });
        fetchUsers(currentPage, searchQuery, roleFilter, statusFilter);
      } else {
        toast({
          title: "Error",
          description: response.error || `Failed to ${actionType} user`,
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setIsActionOpen(false);
    }
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
      case "super_admin":
        return <Badge className="bg-red-100 text-red-800">Super Admin</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && users.length === 0) {
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

  if (error && users.length === 0) {
    return (
      <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
        <DashboardLayout navigation={navigation}>
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <h3 className="text-lg font-medium">Failed to load users</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => fetchUsers(1)}>
              <RefreshCw className="mr-2 h-4 w-4" />
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                User Management
              </h1>
              <p className="text-muted-foreground">
                Manage all users, their roles, and access permissions
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() =>
                  fetchUsers(currentPage, searchQuery, roleFilter, statusFilter)
                }
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.totalUsers}</div>
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
                  {userStats.activeUsers}
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
                  {userStats.institutions}
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
                  {userStats.employers}
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
                  {userStats.suspended}
                </div>
              </CardContent>
            </Card>
          </div>

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
                      placeholder="Search by name, email, or organization..."
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
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="institution_admin">
                        Institution Admin
                      </SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading users...
                </div>
              )}

              {!loading && (
                <div className="space-y-4">
                  {displayUsers.map((user) => (
                    <div
                      key={user.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {`${user.firstName[0]}${user.lastName[0]}`}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-foreground">{`${user.firstName} ${user.lastName}`}</h3>
                              {getRoleBadge(user.role)}
                              {getStatusBadge(user.status)}
                              {user.emailVerified && (
                                <Badge
                                  variant="outline"
                                  className="text-green-600"
                                >
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              {user.organization && (
                                <span>Organization: {user.organization}</span>
                              )}
                              {user.country && (
                                <span>Country: {user.country}</span>
                              )}
                              <span>Joined: {formatDate(user.createdAt)}</span>
                              {user.lastLoginAt && (
                                <span>
                                  Last Login: {formatDate(user.lastLoginAt)}
                                </span>
                              )}
                            </div>
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
              )}

              {!loading && displayUsers.length === 0 && (
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

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        fetchUsers(
                          currentPage - 1,
                          searchQuery,
                          roleFilter,
                          statusFilter
                        )
                      }
                      disabled={currentPage <= 1 || loading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        fetchUsers(
                          currentPage + 1,
                          searchQuery,
                          roleFilter,
                          statusFilter
                        )
                      }
                      disabled={currentPage >= totalPages || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

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
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>First Name</Label>
                        <p className="font-medium">{selectedUser.firstName}</p>
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <p className="font-medium">{selectedUser.lastName}</p>
                      </div>
                      <div>
                        <Label>Email Address</Label>
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                      <div>
                        <Label>Email Verified</Label>
                        <div>
                          {selectedUser.emailVerified ? (
                            <Badge className="bg-green-100 text-green-800">
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not Verified</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label>Role</Label>
                        <div>{getRoleBadge(selectedUser.role)}</div>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <div>{getStatusBadge(selectedUser.status)}</div>
                      </div>
                      {selectedUser.organization && (
                        <div>
                          <Label>Organization</Label>
                          <p className="font-medium">
                            {selectedUser.organization}
                          </p>
                        </div>
                      )}
                      {selectedUser.country && (
                        <div>
                          <Label>Country</Label>
                          <p className="font-medium">{selectedUser.country}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Join Date</Label>
                        <p className="font-medium">
                          {formatDate(selectedUser.createdAt)}
                        </p>
                      </div>
                      <div>
                        <Label>Last Login</Label>
                        <p className="font-medium">
                          {selectedUser.lastLoginAt
                            ? formatDate(selectedUser.lastLoginAt)
                            : "Never"}
                        </p>
                      </div>
                      <div>
                        <Label>Account Status</Label>
                        <div>{getStatusBadge(selectedUser.status)}</div>
                      </div>
                      <div>
                        <Label>Email Status</Label>
                        <div>
                          {selectedUser.emailVerified ? (
                            <Badge className="bg-green-100 text-green-800">
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not Verified</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </DialogContent>
          </Dialog>

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
                  {actionType === "edit" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={selectedUser.firstName}
                            onChange={(e) =>
                              setSelectedUser({
                                ...selectedUser,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={selectedUser.lastName}
                            onChange={(e) =>
                              setSelectedUser({
                                ...selectedUser,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={selectedUser.email}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={selectedUser.role}
                            onValueChange={(value) =>
                              setSelectedUser({
                                ...selectedUser,
                                role: value as User["role"],
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="institution_admin">
                                Institution Admin
                              </SelectItem>
                              <SelectItem value="employer">Employer</SelectItem>
                              <SelectItem value="super_admin">
                                Super Admin
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={selectedUser.status}
                            onValueChange={(value) =>
                              setSelectedUser({
                                ...selectedUser,
                                status: value as User["status"],
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="suspended">
                                Suspended
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="organization">
                          Organization (Optional)
                        </Label>
                        <Input
                          id="organization"
                          value={selectedUser.organization || ""}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              organization: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country (Optional)</Label>
                        <Input
                          id="country"
                          value={selectedUser.country || ""}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              country: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium">{`${selectedUser.firstName} ${selectedUser.lastName}`}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getRoleBadge(selectedUser.role)}
                        {getStatusBadge(selectedUser.status)}
                      </div>
                    </div>
                  )}

                  {(actionType === "suspend" || actionType === "activate") && (
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
                          : ""
                      }
                      onClick={executeUserAction}
                      disabled={actionLoading}
                    >
                      {actionLoading && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
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
