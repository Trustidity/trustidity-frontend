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
  Plus,
  Upload,
  Download,
  Eye,
  Edit,
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

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Building },
  {
    name: "Student Records",
    href: "/dashboard/records",
    icon: FileText,
    current: true,
  },
  { name: "Verification Requests", href: "/dashboard/requests", icon: Clock },
  {
    name: "Approved Documents",
    href: "/dashboard/approved",
    icon: CheckCircle,
  },
];

const studentRecords = [
  {
    id: "1",
    studentId: "UNN/CSC/2023/001234",
    name: "Alice Johnson",
    program: "Computer Science",
    degree: "Bachelor's Degree",
    graduationYear: "2023",
    grade: "Second Class Upper",
    cgpa: "3.65",
    status: "graduated",
    dateAdded: "2023-12-15",
    certificateNumber: "UNN/CSC/2023/001234",
    department: "Computer Science",
  },
  {
    id: "2",
    studentId: "UNN/ENG/2022/005678",
    name: "Bob Smith",
    program: "Electrical Engineering",
    degree: "Bachelor's Degree",
    graduationYear: "2022",
    grade: "First Class",
    cgpa: "4.25",
    status: "graduated",
    dateAdded: "2022-11-20",
    certificateNumber: "UNN/ENG/2022/005678",
    department: "Engineering",
  },
  {
    id: "3",
    studentId: "UNN/MED/2024/009876",
    name: "Carol Davis",
    program: "Medicine",
    degree: "Bachelor's Degree",
    graduationYear: "2024",
    grade: "Second Class Upper",
    cgpa: "3.85",
    status: "current",
    dateAdded: "2020-09-01",
    certificateNumber: "Pending",
    department: "Medicine",
  },
  {
    id: "4",
    studentId: "UNN/LAW/2023/012345",
    name: "David Wilson",
    program: "Law",
    degree: "Bachelor's Degree",
    graduationYear: "2023",
    grade: "Second Class Lower",
    cgpa: "2.95",
    status: "graduated",
    dateAdded: "2023-10-30",
    certificateNumber: "UNN/LAW/2023/012345",
    department: "Law",
  },
];

export default function RecordsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    studentId: "",
    name: "",
    program: "",
    degree: "Bachelor's Degree",
    graduationYear: "",
    grade: "",
    cgpa: "",
    department: "",
  });

  const filteredRecords = studentRecords.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.certificateNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || record.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleAddRecord = () => {
    console.log("Adding new record:", newRecord);
    setIsAddOpen(false);
    setNewRecord({
      studentId: "",
      name: "",
      program: "",
      degree: "Bachelor's Degree",
      graduationYear: "",
      grade: "",
      cgpa: "",
      department: "",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graduated":
        return <Badge className="bg-green-100 text-green-800">Graduated</Badge>;
      case "current":
        return (
          <Badge className="bg-blue-100 text-blue-800">Current Student</Badge>
        );
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "First Class":
        return (
          <Badge className="bg-purple-100 text-purple-800">First Class</Badge>
        );
      case "Second Class Upper":
        return <Badge className="bg-blue-100 text-blue-800">2:1</Badge>;
      case "Second Class Lower":
        return <Badge className="bg-yellow-100 text-yellow-800">2:2</Badge>;
      case "Third Class":
        return (
          <Badge className="bg-orange-100 text-orange-800">Third Class</Badge>
        );
      default:
        return <Badge variant="secondary">{grade}</Badge>;
    }
  };

  const departments = [...new Set(studentRecords.map((r) => r.department))];

  return (
    <ProtectedRoute
      allowedRoles={["institution_admin", "admin", "super_admin"]}
    >
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Student Records
              </h1>
              <p className="text-muted-foreground">
                Manage and maintain comprehensive student academic records
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Bulk Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Upload Student Records</DialogTitle>
                    <DialogDescription>
                      Upload a CSV file containing multiple student records
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drop your CSV file here or click to browse
                      </p>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>
                        Required columns: student_id, name, program, degree,
                        graduation_year, grade, cgpa, department
                      </p>
                      <p>Maximum file size: 10MB</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Student Record</DialogTitle>
                    <DialogDescription>
                      Enter the student's academic information and credentials
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="student-id">Student ID</Label>
                      <Input
                        id="student-id"
                        placeholder="e.g., UNN/CSC/2024/001234"
                        value={newRecord.studentId}
                        onChange={(e) =>
                          setNewRecord((prev) => ({
                            ...prev,
                            studentId: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Student's full name"
                        value={newRecord.name}
                        onChange={(e) =>
                          setNewRecord((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="program">Program of Study</Label>
                      <Input
                        id="program"
                        placeholder="e.g., Computer Science"
                        value={newRecord.program}
                        onChange={(e) =>
                          setNewRecord((prev) => ({
                            ...prev,
                            program: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="degree">Degree Type</Label>
                      <Select
                        value={newRecord.degree}
                        onValueChange={(value) =>
                          setNewRecord((prev) => ({ ...prev, degree: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bachelor's Degree">
                            Bachelor's Degree
                          </SelectItem>
                          <SelectItem value="Master's Degree">
                            Master's Degree
                          </SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                          <SelectItem value="Diploma">Diploma</SelectItem>
                          <SelectItem value="Certificate">
                            Certificate
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="graduation-year">Graduation Year</Label>
                      <Input
                        id="graduation-year"
                        placeholder="e.g., 2024"
                        value={newRecord.graduationYear}
                        onChange={(e) =>
                          setNewRecord((prev) => ({
                            ...prev,
                            graduationYear: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="grade">Grade/Class</Label>
                      <Select
                        value={newRecord.grade}
                        onValueChange={(value) =>
                          setNewRecord((prev) => ({ ...prev, grade: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="First Class">
                            First Class
                          </SelectItem>
                          <SelectItem value="Second Class Upper">
                            Second Class Upper
                          </SelectItem>
                          <SelectItem value="Second Class Lower">
                            Second Class Lower
                          </SelectItem>
                          <SelectItem value="Third Class">
                            Third Class
                          </SelectItem>
                          <SelectItem value="Pass">Pass</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cgpa">CGPA</Label>
                      <Input
                        id="cgpa"
                        placeholder="e.g., 3.65"
                        value={newRecord.cgpa}
                        onChange={(e) =>
                          setNewRecord((prev) => ({
                            ...prev,
                            cgpa: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        placeholder="e.g., Computer Science"
                        value={newRecord.department}
                        onChange={(e) =>
                          setNewRecord((prev) => ({
                            ...prev,
                            department: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddRecord}
                      disabled={!newRecord.studentId || !newRecord.name}
                    >
                      Add Record
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Records
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studentRecords.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Graduated</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {
                    studentRecords.filter((r) => r.status === "graduated")
                      .length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Students
                </CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {studentRecords.filter((r) => r.status === "current").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Departments
                </CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{departments.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Search Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, student ID, program, or certificate number..."
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
                      <SelectItem value="graduated">Graduated</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Records</CardTitle>
              <CardDescription>
                Complete academic records for all students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-foreground">
                            {record.name}
                          </h3>
                          {getStatusBadge(record.status)}
                          {record.status === "graduated" &&
                            getGradeBadge(record.grade)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Student ID:</span>{" "}
                            {record.studentId}
                          </div>
                          <div>
                            <span className="font-medium">Program:</span>{" "}
                            {record.program}
                          </div>
                          <div>
                            <span className="font-medium">Department:</span>{" "}
                            {record.department}
                          </div>
                          <div>
                            <span className="font-medium">Graduation:</span>{" "}
                            {record.graduationYear}
                          </div>
                          <div>
                            <span className="font-medium">Degree:</span>{" "}
                            {record.degree}
                          </div>
                          <div>
                            <span className="font-medium">CGPA:</span>{" "}
                            {record.cgpa}
                          </div>
                          <div>
                            <span className="font-medium">Certificate:</span>{" "}
                            {record.certificateNumber}
                          </div>
                          <div>
                            <span className="font-medium">Added:</span>{" "}
                            {record.dateAdded}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRecords.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No records found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ||
                    statusFilter !== "all" ||
                    departmentFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Start by adding your first student record"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
