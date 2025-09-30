// Core data types for the application
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  organization?: string;
  institutionId?: string;
  companyId?: string;
  country?: string;
  role: "user" | "institution_admin" | "employer" | "super_admin";
  status: "active" | "inactive" | "suspended";
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  type:
    | "degree"
    | "transcript"
    | "certificate"
    | "diploma"
    | "waec"
    | "jamb"
    | "neco";
  status: "pending" | "verified" | "rejected";
  referenceNumber: string;
  certificateNumber: string;
  institutionName: string;
  graduationYear?: string;
  requestDate: string;
  verificationDate?: string;
  rejectionReason?: string;
  institutionId?: string;
}

export interface VerificationRequest {
  id: string;
  documentId: string;
  userId: string;
  institutionId: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  responseDate?: string;
  notes?: string;
}

export interface CertificateVerificationRequest {
  certificateNumber: string;
  institutionName: string;
  documentType:
    | "degree"
    | "transcript"
    | "certificate"
    | "diploma"
    | "waec"
    | "jamb"
    | "neco";
  candidateName?: string;
  graduationYear?: string;
}

export interface Institution {
  id: string;
  name: string;
  type: "university" | "college" | "certification_body" | "government";
  status: "active" | "inactive" | "pending" | "suspended";
  country: string;
  isVerified: boolean;
  contactEmail: string;
  createdAt: string;
}

export interface VerificationResult {
  referenceNumber: string;
  status: "verified" | "not_found" | "pending" | "rejected";
  candidateName?: string;
  documentType?: string;
  institution?: string;
  issueDate?: string;
  verificationDate?: string;
  details?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
