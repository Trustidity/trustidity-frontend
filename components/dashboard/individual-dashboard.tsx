"use client"

import { useState } from "react"
import { DashboardLayout } from "./dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: FileText, current: true },
  { name: "My Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Verification History", href: "/dashboard/history", icon: CheckCircle },
]

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
  },
]

const nigerianInstitutions = [
  "WAEC Nigeria",
  "JAMB",
  "NECO",
  "University of Nigeria, Nsukka",
  "University of Lagos",
  "Ahmadu Bello University",
  "University of Ibadan",
  "Obafemi Awolowo University",
  "University of Benin",
  "Federal University of Technology, Akure",
  "Lagos State University",
  "Covenant University",
  "Babcock University",
  "Other (Please specify)",
]

export function IndividualDashboard() {
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [formData, setFormData] = useState({
    documentType: "",
    certificateNumber: "",
    institutionName: "",
    candidateName: "",
    graduationYear: "",
    customInstitution: "",
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleVerificationRequest = () => {
    const requestData = {
      ...formData,
      institutionName:
        formData.institutionName === "Other (Please specify)" ? formData.customInstitution : formData.institutionName,
    }

    console.log("Requesting verification for:", requestData)
    setIsRequestOpen(false)
    setFormData({
      documentType: "",
      certificateNumber: "",
      institutionName: "",
      candidateName: "",
      graduationYear: "",
      customInstitution: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground">Request verification for your academic and professional credentials</p>
          </div>
          <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Request Verification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Request Document Verification</DialogTitle>
                <DialogDescription>
                  Provide your certificate number and institution details for verification.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select
                    value={formData.documentType}
                    onValueChange={(value) => handleInputChange("documentType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waec">WAEC Certificate</SelectItem>
                      <SelectItem value="jamb">JAMB Result</SelectItem>
                      <SelectItem value="neco">NECO Certificate</SelectItem>
                      <SelectItem value="degree">University Degree</SelectItem>
                      <SelectItem value="transcript">Academic Transcript</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="certificate">Professional Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="certificate-number">Certificate/Registration Number</Label>
                  <Input
                    id="certificate-number"
                    placeholder="e.g., 1234567890 (WAEC) or UNN/CSC/2023/001234"
                    value={formData.certificateNumber}
                    onChange={(e) => handleInputChange("certificateNumber", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the exact number as it appears on your certificate
                  </p>
                </div>

                <div>
                  <Label htmlFor="institution">Institution</Label>
                  <Select
                    value={formData.institutionName}
                    onValueChange={(value) => handleInputChange("institutionName", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution" />
                    </SelectTrigger>
                    <SelectContent>
                      {nigerianInstitutions.map((institution) => (
                        <SelectItem key={institution} value={institution}>
                          {institution}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.institutionName === "Other (Please specify)" && (
                  <div>
                    <Label htmlFor="custom-institution">Institution Name</Label>
                    <Input
                      id="custom-institution"
                      placeholder="Enter institution name"
                      value={formData.customInstitution}
                      onChange={(e) => handleInputChange("customInstitution", e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="candidate-name">Full Name (as on certificate)</Label>
                  <Input
                    id="candidate-name"
                    placeholder="Enter your full name"
                    value={formData.candidateName}
                    onChange={(e) => handleInputChange("candidateName", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="graduation-year">Year of Graduation/Completion</Label>
                  <Input
                    id="graduation-year"
                    placeholder="e.g., 2023"
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsRequestOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleVerificationRequest}
                    disabled={!formData.documentType || !formData.certificateNumber || !formData.institutionName}
                  >
                    Request Verification
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
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">1</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">1</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">1</div>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>My Verification Requests</CardTitle>
            <CardDescription>Track the status of your credential verification requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(doc.status)}
                    <div>
                      <h3 className="font-medium text-foreground">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doc.institutionName} • Certificate: {doc.certificateNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested {doc.requestDate} • Year: {doc.graduationYear}
                      </p>
                      {doc.rejectionReason && (
                        <p className="text-sm text-red-600 mt-1">Reason: {doc.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(doc.status)}
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{doc.referenceNumber}</p>
                      {doc.verificationDate && (
                        <p className="text-xs text-muted-foreground">Verified {doc.verificationDate}</p>
                      )}
                    </div>
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
