"use client"

import { useState } from "react"
import { DashboardLayout } from "./dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, FileText, CheckCircle, Clock, AlertCircle, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: FileText, current: true },
  { name: "Verify Documents", href: "/dashboard/verify", icon: Search },
  { name: "Verification History", href: "/dashboard/history", icon: CheckCircle },
  { name: "Team Management", href: "/dashboard/team", icon: Users },
]

const recentVerifications = [
  {
    id: "1",
    candidateName: "John Smith",
    documentType: "Bachelor's Degree",
    certificateNumber: "UNN/CSC/2023/001234",
    institutionName: "University of Nigeria, Nsukka",
    referenceNumber: "TRU-2024-001234",
    status: "verified",
    verifiedDate: "2024-01-20",
  },
  {
    id: "2",
    candidateName: "Sarah Johnson",
    documentType: "WAEC Certificate",
    certificateNumber: "2345678901",
    institutionName: "WAEC Nigeria",
    referenceNumber: "TRU-2024-001235",
    status: "not_found",
    verifiedDate: "2024-01-19",
  },
  {
    id: "3",
    candidateName: "Mike Chen",
    documentType: "JAMB Result",
    certificateNumber: "12345678",
    institutionName: "JAMB",
    referenceNumber: "TRU-2024-001236",
    status: "pending",
    verifiedDate: "2024-01-18",
  },
]

export function EmployerDashboard() {
  const [searchType, setSearchType] = useState("reference")
  const [searchQuery, setSearchQuery] = useState("")
  const [certificateNumber, setCertificateNumber] = useState("")
  const [institutionName, setInstitutionName] = useState("")
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (searchType === "reference" && !searchQuery.trim()) return
    if (searchType === "certificate" && (!certificateNumber.trim() || !institutionName.trim())) return

    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      // Mock search result based on search type
      if (searchType === "reference") {
        setSearchResults({
          referenceNumber: searchQuery,
          status: "verified",
          candidateName: "John Doe",
          documentType: "Bachelor's Degree in Computer Science",
          certificateNumber: "UNN/CSC/2023/001234",
          institution: "University of Nigeria, Nsukka",
          graduationYear: "2023",
          verificationDate: "2024-01-20",
        })
      } else {
        setSearchResults({
          certificateNumber: certificateNumber,
          institutionName: institutionName,
          status: "verified",
          candidateName: "Jane Smith",
          documentType: "WAEC Certificate",
          graduationYear: "2019",
          verificationDate: "2024-01-20",
          referenceNumber: "TRU-2024-001237",
        })
      }
      setIsSearching(false)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "not_found":
        return <Badge className="bg-red-100 text-red-800">Not Found</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employer Dashboard</h1>
          <p className="text-muted-foreground">
            Verify candidate credentials by reference number or certificate details
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">98</div>
              <p className="text-xs text-muted-foreground">77% success rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">15</div>
              <p className="text-xs text-muted-foreground">Avg. 2 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Found</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">14</div>
              <p className="text-xs text-muted-foreground">11% of total</p>
            </CardContent>
          </Card>
        </div>

        {/* Document Verification */}
        <Card>
          <CardHeader>
            <CardTitle>Verify Document</CardTitle>
            <CardDescription>Search by reference number or certificate details to verify credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Search Method</Label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reference">By Reference Number</SelectItem>
                  <SelectItem value="certificate">By Certificate Details</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {searchType === "reference" ? (
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="search">Reference Number</Label>
                  <Input
                    id="search"
                    placeholder="Enter reference number (e.g., TRU-2024-001234)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? "Searching..." : "Verify"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cert-number">Certificate Number</Label>
                    <Input
                      id="cert-number"
                      placeholder="e.g., 1234567890 or UNN/CSC/2023/001234"
                      value={certificateNumber}
                      onChange={(e) => setCertificateNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      placeholder="e.g., WAEC Nigeria, University of Lagos"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? "Searching..." : "Verify Certificate"}
                  </Button>
                </div>
              </div>
            )}

            {searchResults && (
              <div className="mt-6 p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Verification Result</h3>
                  {getStatusBadge(searchResults.status)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Candidate Name</p>
                    <p className="font-medium">{searchResults.candidateName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Document Type</p>
                    <p className="font-medium">{searchResults.documentType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Institution</p>
                    <p className="font-medium">{searchResults.institution || searchResults.institutionName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Graduation Year</p>
                    <p className="font-medium">{searchResults.graduationYear || searchResults.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Certificate Number</p>
                    <p className="font-medium">{searchResults.certificateNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reference Number</p>
                    <p className="font-medium">{searchResults.referenceNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Verified On</p>
                    <p className="font-medium">{searchResults.verificationDate}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Verifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Verifications</CardTitle>
            <CardDescription>Your latest credential verification activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVerifications.map((verification) => (
                <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">{verification.candidateName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {verification.documentType} • {verification.institutionName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Certificate: {verification.certificateNumber} • Ref: {verification.referenceNumber}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(verification.status)}
                    <p className="text-sm text-muted-foreground">{verification.verifiedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
