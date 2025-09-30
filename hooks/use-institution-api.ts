"use client"

import { getToken } from "@/lib/auth"
import type { ApiResponse } from "@/lib/types"
import { useCallback, useMemo } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface InstitutionDashboardStats {
  totalStudents: number
  pendingRequests: number
  approvedThisMonth: number
  rejectedRequests: number
}

interface VerificationRequest {
  id: string
  studentName: string
  documentType: string
  program: string
  graduationYear: string
  status: "pending" | "approved" | "rejected"
  requestDate: string
  referenceNumber: string
}

interface InstitutionCredential {
  id: string
  studentName: string
  documentType: string
  program: string
  graduationYear: string
  issueDate: string
  credentialHash: string
}

interface ActivityLog {
  id: string
  action: string
  description: string
  timestamp: string
  userId?: string
  userName?: string
}

class InstitutionApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = getToken()
    const url = `${this.baseURL}${endpoint}`

    console.log("[v0] API Request:", url)
    console.log("[v0] Token available:", !!token)

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      console.log("[v0] API Response status:", response.status)
      console.log("[v0] API Response data:", data)

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      }
    } catch (error) {
      console.error("[v0] API Request error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }

  // Institution registration
  async registerInstitution(institutionData: {
    name: string
    type: string
    address: string
    city: string
    state: string
    country: string
    contactEmail: string
    contactPhone?: string
    website?: string
    establishedYear?: number
    description?: string
  }): Promise<ApiResponse<{ institution: any; message: string }>> {
    return this.request("/institutions/register", {
      method: "POST",
      body: JSON.stringify(institutionData),
    })
  }

  // Get institution dashboard statistics
  async getDashboardStats(institutionId: string): Promise<ApiResponse<InstitutionDashboardStats>> {
    return this.request(`/institutions/${institutionId}/dashboard`)
  }

  // Get institution credentials
  async getCredentials(
    institutionId: string,
    page = 1,
    limit = 20,
    search?: string,
    status?: string,
  ): Promise<ApiResponse<{ credentials: InstitutionCredential[]; pagination: any }>> {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())
    if (search) params.append("search", search)
    if (status) params.append("status", status)

    return this.request(`/institutions/${institutionId}/credentials?${params.toString()}`)
  }

  // Add a new credential
  async addCredential(
    institutionId: string,
    credentialData: {
      studentName: string
      documentType: string
      program: string
      graduationYear: string
      studentId?: string
      additionalData?: Record<string, any>
    },
  ): Promise<ApiResponse<InstitutionCredential>> {
    return this.request(`/institutions/${institutionId}/credentials`, {
      method: "POST",
      body: JSON.stringify(credentialData),
    })
  }

  // Get verification requests for institution
  async getVerificationRequests(
    institutionId: string,
    page = 1,
    limit = 20,
    status?: string,
  ): Promise<ApiResponse<{ requests: VerificationRequest[]; pagination: any }>> {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())
    if (status) params.append("status", status)

    const response = await this.request<{ verificationRequests: VerificationRequest[]; pagination: any }>(
      `/institutions/${institutionId}/verification-requests?${params.toString()}`,
    )

    // Transform the response to match expected frontend structure
    if (response.success && response.data) {
      return {
        success: true,
        data: {
          requests: response.data.verificationRequests || [],
          pagination: response.data.pagination,
        },
        message: response.message,
      }
    }

    // Return error response with correct structure
    return {
      success: false,
      error: response.error || "Failed to fetch verification requests",
    }
  }

  // Approve verification request
  async approveVerificationRequest(
    institutionId: string,
    requestId: string,
    notes?: string,
  ): Promise<ApiResponse<VerificationRequest>> {
    return this.request(`/institutions/${institutionId}/verification-requests/${requestId}/approve`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    })
  }

  // Reject verification request
  async rejectVerificationRequest(
    institutionId: string,
    requestId: string,
    reason: string,
  ): Promise<ApiResponse<VerificationRequest>> {
    return this.request(`/institutions/${institutionId}/verification-requests/${requestId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  }

  // Invite institution admin
  async inviteAdmin(
    institutionId: string,
    adminData: {
      email: string
      firstName: string
      lastName: string
      role?: string
    },
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/institutions/${institutionId}/admins`, {
      method: "POST",
      body: JSON.stringify(adminData),
    })
  }

  // Get institution activity logs
  async getActivityLogs(
    institutionId: string,
    page = 1,
    limit = 20,
  ): Promise<ApiResponse<{ logs: ActivityLog[]; pagination: any }>> {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())

    return this.request(`/institutions/${institutionId}/activity-logs?${params.toString()}`)
  }

  // Bulk upload student records
  async bulkUploadRecords(
    institutionId: string,
    formData: FormData,
  ): Promise<ApiResponse<{ message: string; processed: number; errors: any[] }>> {
    const token = getToken()
    const response = await fetch(`${this.baseURL}/institutions/${institutionId}/bulk-upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `Upload failed: ${response.status}`,
      }
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    }
  }

  // Get institution profile
  async getInstitutionProfile(institutionId: string): Promise<ApiResponse<any>> {
    return this.request(`/institutions/${institutionId}/profile`)
  }

  // Update institution profile
  async updateInstitutionProfile(institutionId: string, updates: Record<string, any>): Promise<ApiResponse<any>> {
    return this.request(`/institutions/${institutionId}/profile`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }
}

const institutionApiClient = new InstitutionApiClient(API_BASE_URL)

export const useInstitutionApi = () => {
  // export default function useInstitutionApi() {
  const registerInstitution = useCallback(
    (institutionData: Parameters<typeof institutionApiClient.registerInstitution>[0]) =>
      institutionApiClient.registerInstitution(institutionData),
    [],
  )

  const getDashboardStats = useCallback(
    (institutionId: string) => institutionApiClient.getDashboardStats(institutionId),
    [],
  )

  const getCredentials = useCallback(
    (institutionId: string, page?: number, limit?: number, search?: string, status?: string) =>
      institutionApiClient.getCredentials(institutionId, page, limit, search, status),
    [],
  )

  const addCredential = useCallback(
    (institutionId: string, credentialData: Parameters<typeof institutionApiClient.addCredential>[1]) =>
      institutionApiClient.addCredential(institutionId, credentialData),
    [],
  )

  const getVerificationRequests = useCallback(
    (institutionId: string, page?: number, limit?: number, status?: string) =>
      institutionApiClient.getVerificationRequests(institutionId, page, limit, status),
    [],
  )

  const approveVerificationRequest = useCallback(
    (institutionId: string, requestId: string, notes?: string) =>
      institutionApiClient.approveVerificationRequest(institutionId, requestId, notes),
    [],
  )

  const rejectVerificationRequest = useCallback(
    (institutionId: string, requestId: string, reason: string) =>
      institutionApiClient.rejectVerificationRequest(institutionId, requestId, reason),
    [],
  )

  const inviteAdmin = useCallback(
    (institutionId: string, adminData: Parameters<typeof institutionApiClient.inviteAdmin>[1]) =>
      institutionApiClient.inviteAdmin(institutionId, adminData),
    [],
  )

  const getActivityLogs = useCallback(
    (institutionId: string, page?: number, limit?: number) =>
      institutionApiClient.getActivityLogs(institutionId, page, limit),
    [],
  )

  const bulkUploadRecords = useCallback(
    (institutionId: string, formData: FormData) => institutionApiClient.bulkUploadRecords(institutionId, formData),
    [],
  )

  const getInstitutionProfile = useCallback(
    (institutionId: string) => institutionApiClient.getInstitutionProfile(institutionId),
    [],
  )

  const updateInstitutionProfile = useCallback(
    (institutionId: string, updates: Record<string, any>) =>
      institutionApiClient.updateInstitutionProfile(institutionId, updates),
    [],
  )

  return useMemo(
    () => ({
      registerInstitution,
      getDashboardStats,
      getCredentials,
      addCredential,
      getVerificationRequests,
      approveVerificationRequest,
      rejectVerificationRequest,
      inviteAdmin,
      getActivityLogs,
      bulkUploadRecords,
      getInstitutionProfile,
      updateInstitutionProfile,
    }),
    [
      registerInstitution,
      getDashboardStats,
      getCredentials,
      addCredential,
      getVerificationRequests,
      approveVerificationRequest,
      rejectVerificationRequest,
      inviteAdmin,
      getActivityLogs,
      bulkUploadRecords,
      getInstitutionProfile,
      updateInstitutionProfile,
    ],
  )
}

// export { useInstitutionApi }
