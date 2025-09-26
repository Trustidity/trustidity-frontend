"use client"

import { DashboardLayout } from "./dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, Clock, AlertCircle, Users, Building } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Building, current: true },
  { name: "Student Records", href: "/dashboard/records", icon: FileText },
  { name: "Verification Requests", href: "/dashboard/requests", icon: Clock },
  { name: "Approved Documents", href: "/dashboard/approved", icon: CheckCircle },
]

// Mock data
const verificationRequests = [
  {
    id: "1",
    studentName: "Alice Johnson",
    documentType: "Bachelor's Degree",
    program: "Computer Science",
    graduationYear: "2023",
    status: "pending",
    requestDate: "2024-01-20",
    referenceNumber: "TRU-2024-001234",
  },
  {
    id: "2",
    studentName: "Bob Smith",
    documentType: "Master's Transcript",
    program: "Data Science",
    graduationYear: "2022",
    status: "pending",
    requestDate: "2024-01-19",
    referenceNumber: "TRU-2024-001235",
  },
  {
    id: "3",
    studentName: "Carol Davis",
    documentType: "PhD Certificate",
    program: "Machine Learning",
    graduationYear: "2021",
    status: "approved",
    requestDate: "2024-01-18",
    referenceNumber: "TRU-2024-001236",
  },
]

export function InstitutionDashboard() {
  const handleApprove = (id: string) => {
    console.log("Approving verification:", id)
  }

  const handleReject = (id: string) => {
    console.log("Rejecting verification:", id)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Institution Dashboard</h1>
          <p className="text-muted-foreground">Manage student records and verification requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">Active records</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">23</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">156</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">8</div>
              <p className="text-xs text-muted-foreground">5% rejection rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Verification Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Requests</CardTitle>
            <CardDescription>Review and approve student credential verification requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verificationRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium text-foreground">{request.studentName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {request.documentType} • {request.program} • Class of {request.graduationYear}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ref: {request.referenceNumber} • Requested {request.requestDate}
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
                          className="text-red-600 hover:text-red-700"
                        >
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(request.id)}>
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Upload Student Records
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Student Database
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved verification for John Doe</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uploaded 50 new student records</span>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rejected verification for Jane Smith</span>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
