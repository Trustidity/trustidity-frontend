"use client";

import { getToken } from "@/lib/auth";
import type {
  ApiResponse,
  Document,
  VerificationResult,
  VerificationRequest,
  User,
  Institution,
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = getToken();
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error:
            data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Network error occurred",
      };
    }
  }

  // Auth endpoints
  async login(
    email: string,
    password: string
  ): Promise<
    ApiResponse<{
      user: User;
      tokens: { accessToken: string; refreshToken: string };
    }>
  > {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string
  ): Promise<
    ApiResponse<{
      user: User;
      tokens: { accessToken: string; refreshToken: string };
    }>
  > {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, firstName, lastName, role }),
    });
  }

  async refreshToken(
    refreshToken: string
  ): Promise<ApiResponse<{ accessToken: string }>> {
    return this.request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Document endpoints
  async uploadDocument(formData: FormData): Promise<ApiResponse<Document>> {
    const token = getToken();
    const response = await fetch(`${this.baseURL}/documents/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `Upload failed: ${response.status}`,
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  }

  async getDocuments(): Promise<ApiResponse<Document[]>> {
    return this.request("/documents");
  }

  async getDocument(id: string): Promise<ApiResponse<Document>> {
    return this.request(`/documents/${id}`);
  }

  async deleteDocument(id: string): Promise<ApiResponse<void>> {
    return this.request(`/documents/${id}`, {
      method: "DELETE",
    });
  }

  // Verification endpoints
  async verifyDocument(
    referenceNumber: string
  ): Promise<ApiResponse<VerificationResult>> {
    return this.request(`/verify/${referenceNumber}`);
  }

  async getVerificationRequests(): Promise<ApiResponse<VerificationRequest[]>> {
    return this.request("/verifications");
  }

  async approveVerification(
    id: string,
    notes?: string
  ): Promise<ApiResponse<VerificationRequest>> {
    return this.request(`/verifications/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  }

  async rejectVerification(
    id: string,
    reason: string
  ): Promise<ApiResponse<VerificationRequest>> {
    return this.request(`/verifications/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  // Admin endpoints
  async getUsers(
    page = 1,
    limit = 20
  ): Promise<ApiResponse<{ users: User[]; pagination: any }>> {
    return this.request(`/admin/users?page=${page}&limit=${limit}`);
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request(`/admin/users/${id}`);
  }

  async updateUser(
    id: string,
    updates: Partial<User>
  ): Promise<ApiResponse<User>> {
    return this.request(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request(`/admin/users/${id}`, {
      method: "DELETE",
    });
  }

  async getInstitutions(): Promise<ApiResponse<Institution[]>> {
    return this.request("/admin/institutions");
  }

  async createInstitution(
    institution: Omit<Institution, "id" | "createdAt">
  ): Promise<ApiResponse<Institution>> {
    return this.request("/admin/institutions", {
      method: "POST",
      body: JSON.stringify(institution),
    });
  }

  async updateInstitution(
    id: string,
    updates: Partial<Institution>
  ): Promise<ApiResponse<Institution>> {
    return this.request(`/admin/institutions/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  // Analytics endpoints
  async getAnalytics(timeframe: "7d" | "30d" | "90d" = "30d"): Promise<
    ApiResponse<{
      totalVerifications: number;
      successRate: number;
      avgProcessingTime: number;
      topInstitutions: Array<{ name: string; count: number }>;
    }>
  > {
    return this.request(`/analytics?timeframe=${timeframe}`);
  }

  // Notification endpoints
  async getNotifications(): Promise<
    ApiResponse<
      Array<{
        id: string;
        type: "info" | "warning" | "error" | "success";
        title: string;
        message: string;
        read: boolean;
        createdAt: string;
      }>
    >
  > {
    return this.request("/notifications");
  }

  async markNotificationRead(id: string): Promise<ApiResponse<void>> {
    return this.request(`/notifications/${id}/read`, {
      method: "POST",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Custom hooks for common API operations
export const useApi = () => {
  return {
    // Auth
    login: apiClient.login.bind(apiClient),
    register: apiClient.register.bind(apiClient),
    refreshToken: apiClient.refreshToken.bind(apiClient),

    // Documents
    uploadDocument: apiClient.uploadDocument.bind(apiClient),
    getDocuments: apiClient.getDocuments.bind(apiClient),
    getDocument: apiClient.getDocument.bind(apiClient),
    deleteDocument: apiClient.deleteDocument.bind(apiClient),

    // Verifications
    verifyDocument: apiClient.verifyDocument.bind(apiClient),
    getVerificationRequests: apiClient.getVerificationRequests.bind(apiClient),
    approveVerification: apiClient.approveVerification.bind(apiClient),
    rejectVerification: apiClient.rejectVerification.bind(apiClient),

    // Admin
    getUsers: apiClient.getUsers.bind(apiClient),
    getUser: apiClient.getUser.bind(apiClient),
    updateUser: apiClient.updateUser.bind(apiClient),
    deleteUser: apiClient.deleteUser.bind(apiClient),
    getInstitutions: apiClient.getInstitutions.bind(apiClient),
    createInstitution: apiClient.createInstitution.bind(apiClient),
    updateInstitution: apiClient.updateInstitution.bind(apiClient),

    // Analytics
    getAnalytics: apiClient.getAnalytics.bind(apiClient),

    // Notifications
    getNotifications: apiClient.getNotifications.bind(apiClient),
    markNotificationRead: apiClient.markNotificationRead.bind(apiClient),
  };
};
