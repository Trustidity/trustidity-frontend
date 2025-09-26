"use client";

import type React from "react";

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
  Search,
  FileText,
  CheckCircle,
  Users,
  Download,
  Eye,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: FileText },
  {
    name: "Verify Documents",
    href: "/dashboard/verify",
    icon: Search,
    current: true,
  },
  {
    name: "Verification History",
    href: "/dashboard/history",
    icon: CheckCircle,
  },
  { name: "Team Management", href: "/dashboard/team", icon: Users },
];

export default function VerifyPage() {
  const [searchType, setSearchType] = useState("reference");
  const [searchQuery, setSearchQuery] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkResults, setBulkResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (searchType === "reference" && !searchQuery.trim()) return;
    if (
      searchType === "certificate" &&
      (!certificateNumber.trim() || !institutionName.trim())
    )
      return;

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
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
          verifiedBy: "Institution Admin",
          grade: "Second Class Upper",
          cgpa: "3.65",
        });
      } else {
        setSearchResults({
          certificateNumber: certificateNumber,
          institutionName: institutionName,
          candidateName: candidateName || "Jane Smith",
          status: "verified",
          documentType: "WAEC Certificate",
          graduationYear: "2019",
          verificationDate: "2024-01-20",
          referenceNumber: "TRU-2024-001237",
          subjects: [
            { subject: "Mathematics", grade: "A1" },
            { subject: "English Language", grade: "B2" },
            { subject: "Physics", grade: "A1" },
            { subject: "Chemistry", grade: "B3" },
            { subject: "Biology", grade: "A1" },
          ],
        });
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBulkFile(file);
      // Simulate processing bulk file
      setTimeout(() => {
        setBulkResults([
          {
            row: 1,
            candidateName: "Alice Johnson",
            referenceNumber: "TRU-2024-001240",
            status: "verified",
            documentType: "Bachelor's Degree",
            institution: "University of Lagos",
          },
          {
            row: 2,
            candidateName: "Bob Smith",
            referenceNumber: "TRU-2024-001241",
            status: "not_found",
            documentType: "Master's Degree",
            institution: "University of Ibadan",
          },
          {
            row: 3,
            candidateName: "Carol Davis",
            referenceNumber: "TRU-2024-001242",
            status: "verified",
            documentType: "WAEC Certificate",
            institution: "WAEC Nigeria",
          },
        ]);
      }, 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "not_found":
        return <Badge className="bg-red-100 text-red-800">Not Found</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["employer", "user"]}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Verify Documents
            </h1>
            <p className="text-muted-foreground">
              Verify candidate credentials by reference number, certificate
              details, or bulk upload
            </p>
          </div>

          <Tabs defaultValue="single" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Verification</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Verification</TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="space-y-6">
              {/* Single Document Verification */}
              <Card>
                <CardHeader>
                  <CardTitle>Single Document Verification</CardTitle>
                  <CardDescription>
                    Search by reference number or certificate details to verify
                    credentials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Search Method</Label>
                    <Select value={searchType} onValueChange={setSearchType}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reference">
                          By Reference Number
                        </SelectItem>
                        <SelectItem value="certificate">
                          By Certificate Details
                        </SelectItem>
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
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleSearch()
                          }
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
                          <Label htmlFor="cert-number">
                            Certificate Number
                          </Label>
                          <Input
                            id="cert-number"
                            placeholder="e.g., 1234567890 or UNN/CSC/2023/001234"
                            value={certificateNumber}
                            onChange={(e) =>
                              setCertificateNumber(e.target.value)
                            }
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
                      <div>
                        <Label htmlFor="candidate-name">
                          Candidate Name (Optional)
                        </Label>
                        <Input
                          id="candidate-name"
                          placeholder="Enter candidate's full name"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleSearch} disabled={isSearching}>
                          {isSearching ? "Searching..." : "Verify Certificate"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {searchResults && (
                    <div className="mt-6 p-6 border rounded-lg bg-card">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">
                          Verification Result
                        </h3>
                        {getStatusBadge(searchResults.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Candidate Name
                            </p>
                            <p className="font-medium text-lg">
                              {searchResults.candidateName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Document Type
                            </p>
                            <p className="font-medium">
                              {searchResults.documentType}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Institution
                            </p>
                            <p className="font-medium">
                              {searchResults.institution ||
                                searchResults.institutionName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Graduation Year
                            </p>
                            <p className="font-medium">
                              {searchResults.graduationYear}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Certificate Number
                            </p>
                            <p className="font-medium">
                              {searchResults.certificateNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Reference Number
                            </p>
                            <p className="font-medium text-primary">
                              {searchResults.referenceNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Verified On
                            </p>
                            <p className="font-medium">
                              {searchResults.verificationDate}
                            </p>
                          </div>
                          {searchResults.verifiedBy && (
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Verified By
                              </p>
                              <p className="font-medium">
                                {searchResults.verifiedBy}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional Details */}
                      {searchResults.grade && (
                        <div className="mt-6 pt-6 border-t">
                          <h4 className="font-medium mb-3">Academic Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Grade/Class
                              </p>
                              <p className="font-medium">
                                {searchResults.grade}
                              </p>
                            </div>
                            {searchResults.cgpa && (
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  CGPA
                                </p>
                                <p className="font-medium">
                                  {searchResults.cgpa}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {searchResults.subjects && (
                        <div className="mt-6 pt-6 border-t">
                          <h4 className="font-medium mb-3">Subject Results</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {searchResults.subjects.map(
                              (subject: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-between p-2 bg-muted rounded"
                                >
                                  <span>{subject.subject}</span>
                                  <span className="font-medium">
                                    {subject.grade}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-6">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Certificate
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-6">
              {/* Bulk Verification */}
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Document Verification</CardTitle>
                  <CardDescription>
                    Upload a CSV file with multiple reference numbers or
                    certificate details for batch verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Upload CSV File</h3>
                        <p className="text-sm text-muted-foreground">
                          Upload a CSV file containing reference numbers or
                          certificate details
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleBulkUpload}
                          className="hidden"
                          id="bulk-upload"
                        />
                        <label htmlFor="bulk-upload">
                          <Button asChild>
                            <span>Choose File</span>
                          </Button>
                        </label>
                        {bulkFile && (
                          <p className="text-sm text-muted-foreground">
                            Selected: {bulkFile.name}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>
                          CSV format: reference_number, candidate_name
                          (optional)
                        </p>
                        <p>Maximum file size: 10MB</p>
                      </div>
                    </div>
                  </div>

                  {bulkResults.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          Bulk Verification Results
                        </h3>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download Results
                        </Button>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted px-4 py-2 font-medium text-sm">
                          Processed {bulkResults.length} records
                        </div>
                        <div className="divide-y">
                          {bulkResults.map((result, index) => (
                            <div
                              key={index}
                              className="p-4 flex items-center justify-between"
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                  <span className="text-sm text-muted-foreground">
                                    Row {result.row}
                                  </span>
                                  <div>
                                    <p className="font-medium">
                                      {result.candidateName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {result.documentType} •{" "}
                                      {result.institution}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Ref: {result.referenceNumber}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(result.status)}
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
