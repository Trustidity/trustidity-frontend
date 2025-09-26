// Mock API responses for development/testing
import type { User, Document, VerificationResult, Institution, ApiResponse } from "./types"

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    email: "john@example.com",
    name: "John Smith",
    role: "individual",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    isActive: true,
  },
  {
    id: "2",
    email: "hr@techcorp.com",
    name: "TechCorp HR",
    role: "employer",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
    isActive: true,
  },
]

const mockDocuments: Document[] = [
  {
    id: "1",
    userId: "1",
    name: "Bachelor's Degree - Computer Science",
    type: "degree",
    status: "verified",
    referenceNumber: "TRU-2024-001234",
    uploadDate: "2024-01-15T10:00:00Z",
    verificationDate: "2024-01-16T10:00:00Z",
    fileUrl: "/documents/degree-cs.pdf",
    institutionId: "1",
  },
  {
    id: "2",
    userId: "1",
    name: "Master's Transcript",
    type: "transcript",
    status: "pending",
    referenceNumber: "TRU-2024-001235",
    uploadDate: "2024-01-20T10:00:00Z",
    fileUrl: "/documents/transcript-ms.pdf",
  },
]

const mockInstitutions: Institution[] = [
  {
    id: "1",
    name: "Stanford University",
    type: "university",
    country: "United States",
    isVerified: true,
    contactEmail: "verify@stanford.edu",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    name: "MIT",
    type: "university",
    country: "United States",
    isVerified: true,
    contactEmail: "credentials@mit.edu",
    createdAt: "2024-01-01T10:00:00Z",
  },
]

// Mock API functions for development
export class MockApiClient {
  private delay(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    await this.delay(1000)

    const user = mockUsers.find((u) => u.email === email)
    if (!user) {
      return { success: false, error: "Invalid credentials" }
    }

    return {
      success: true,
      data: {
        user,
        token: "mock-jwt-token-" + Date.now(),
      },
    }
  }

  async register(
    email: string,
    password: string,
    name: string,
    role: string,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    await this.delay(1000)

    const newUser: User = {
      id: String(mockUsers.length + 1),
      email,
      name,
      role: role as User["role"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    }

    mockUsers.push(newUser)

    return {
      success: true,
      data: {
        user: newUser,
        token: "mock-jwt-token-" + Date.now(),
      },
    }
  }

  async getDocuments(): Promise<ApiResponse<Document[]>> {
    await this.delay(500)
    return { success: true, data: mockDocuments }
  }

  async verifyDocument(referenceNumber: string): Promise<ApiResponse<VerificationResult>> {
    await this.delay(1500)

    const document = mockDocuments.find((d) => d.referenceNumber === referenceNumber)
    if (!document) {
      return {
        success: true,
        data: {
          referenceNumber,
          status: "not_found",
        },
      }
    }

    const institution = mockInstitutions.find((i) => i.id === document.institutionId)

    return {
      success: true,
      data: {
        referenceNumber,
        status: document.status as VerificationResult["status"],
        candidateName: "John Smith",
        documentType: document.name,
        institution: institution?.name,
        issueDate: "2023-05-15",
        verificationDate: document.verificationDate,
      },
    }
  }

  async getUsers(): Promise<ApiResponse<{ users: User[]; pagination: any }>> {
    await this.delay(500)
    return {
      success: true,
      data: {
        users: mockUsers,
        pagination: { page: 1, limit: 20, total: mockUsers.length, totalPages: 1 },
      },
    }
  }

  async getInstitutions(): Promise<ApiResponse<Institution[]>> {
    await this.delay(500)
    return { success: true, data: mockInstitutions }
  }
}

// Export mock client for development
export const mockApiClient = new MockApiClient()
