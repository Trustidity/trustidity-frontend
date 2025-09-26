"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, FileText, CheckCircle, Users, Plus, Mail, Shield, Settings, Trash2 } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: FileText },
  { name: "Verify Documents", href: "/dashboard/verify", icon: Search },
  { name: "Verification History", href: "/dashboard/history", icon: CheckCircle },
  { name: "Team Management", href: "/dashboard/team", icon: Users, current: true },
]

const teamMembers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "admin",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2024-01-25",
    verificationsCount: 45,
    department: "HR",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    role: "verifier",
    status: "active",
    joinDate: "2024-01-10",
    lastActive: "2024-01-24",
    verificationsCount: 32,
    department: "Recruitment",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "viewer",
    status: "pending",
    joinDate: "2024-01-20",
    lastActive: "Never",
    verificationsCount: 0,
    department: "Legal",
  },
  {
    id: "4",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "verifier",
    status: "inactive",
    joinDate: "2023-12-01",
    lastActive: "2024-01-10",
    verificationsCount: 78,
    department: "HR",
  },
]

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "viewer",
    department: "",
  })

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || member.role === roleFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleInvite = () => {
    console.log("Inviting team member:", inviteData)
    setIsInviteOpen(false)
    setInviteData({ email: "", role: "viewer", department: "" })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="default">Admin</Badge>
      case "verifier":
        return <Badge variant="outline">Verifier</Badge>
      case "viewer":
        return <Badge variant="secondary">Viewer</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-blue-600" />
      case "verifier":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "viewer":
        return <Users className="h-4 w-4 text-gray-600" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <ProtectedRoute allowedRoles={["employer"]}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
              <p className="text-muted-foreground">Manage team members and their access to verification features</p>
            </div>
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to a new team member to join your organization
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@company.com"
                      value={inviteData.email}
                      onChange={(e) => setInviteData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={inviteData.role}
                      onValueChange={(value) => setInviteData((prev) => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer - Can view verification results</SelectItem>
                        <SelectItem value="verifier">Verifier - Can perform verifications</SelectItem>
                        <SelectItem value="admin">Admin - Full access and team management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="e.g., HR, Recruitment, Legal"
                      value={inviteData.department}
                      onChange={(e) => setInviteData((prev) => ({ ...prev, department: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleInvite} disabled={!inviteData.email}>
                      Send Invitation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamMembers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {teamMembers.filter((m) => m.status === "active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
                <Mail className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {teamMembers.filter((m) => m.status === "pending").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamMembers.reduce((sum, m) => sum + m.verificationsCount, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or department..."
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
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="verifier">Verifier</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
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
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Team Members List */}
              <div className="space-y-4">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-foreground">{member.name}</h3>
                            {getRoleIcon(member.role)}
                            {getRoleBadge(member.role)}
                            {getStatusBadge(member.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>Department: {member.department}</span>
                            <span>Joined: {member.joinDate}</span>
                            <span>Last Active: {member.lastActive}</span>
                            <span>Verifications: {member.verificationsCount}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                        {member.status === "pending" && (
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4 mr-1" />
                            Resend
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No team members found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || roleFilter !== "all" || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Start by inviting your first team member"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Understanding what each role can do in your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium">Viewer</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• View verification results</li>
                    <li>• Access verification history</li>
                    <li>• Download reports</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Verifier</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• All Viewer permissions</li>
                    <li>• Perform document verifications</li>
                    <li>• Bulk verification uploads</li>
                    <li>• Create verification requests</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Admin</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• All Verifier permissions</li>
                    <li>• Manage team members</li>
                    <li>• Send invitations</li>
                    <li>• Configure organization settings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
