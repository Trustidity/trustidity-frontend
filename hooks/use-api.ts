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

  async forgotPassword(
    email: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(
    token: string,
    password: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  }

  async verify2FA(
    email: string,
    code: string
  ): Promise<
    ApiResponse<{
      user: User;
      tokens: { accessToken: string; refreshToken: string };
    }>
  > {
    return this.request("/auth/verify-2fa", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  }

  async resend2FA(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request("/auth/resend-2fa", {
      method: "POST",
      body: JSON.stringify({ email }),
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

  async getInstitutions(
    page = 1,
    limit = 20,
    search?: string,
    status?: string,
    type?: string
  ): Promise<ApiResponse<{ institutions: Institution[]; pagination: any }>> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (type) params.append("type", type);

    return this.request(`/admin/institutions?${params.toString()}`);
  }

  async getInstitution(id: string): Promise<ApiResponse<Institution>> {
    return this.request(`/admin/institutions/${id}`);
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

  async deleteInstitution(id: string): Promise<ApiResponse<void>> {
    return this.request(`/admin/institutions/${id}`, {
      method: "DELETE",
    });
  }

  async getDashboardStats(): Promise<
    ApiResponse<{
      overview: {
        totalUsers: number;
        totalInstitutions: number;
        totalVerifications: number;
        recentUsers: number;
        recentVerifications: number;
      };
      verificationStats: Array<{ status: string; count: string }>;
      revenue: {
        totalRevenue: number;
        paidVerifications: number;
      };
      topInstitutions: Array<{
        institutionName: string;
        verificationCount: string;
      }>;
    }>
  > {
    return this.request("/admin/dashboard");
  }

  async getAnalyticsDashboard(
    startDate?: string,
    endDate?: string
  ): Promise<
    ApiResponse<{
      totalVerifications: number;
      successfulVerifications: number;
      failedVerifications: number;
      totalCredentials: number;
      totalInstitutions: number;
      totalUsers: number;
      revenueData: {
        total: number;
        thisMonth: number;
        lastMonth: number;
        growth: number;
      };
      verificationTrends: Array<{
        date: string;
        count: number;
        success: number;
        failed: number;
      }>;
      topInstitutions: Array<{
        name: string;
        credentialCount: number;
        verificationCount: number;
      }>;
      geographicData: Array<{
        country: string;
        region: string;
        count: number;
      }>;
      fraudDetectionStats: {
        totalFlagged: number;
        falsePositives: number;
        truePositives: number;
        accuracy: number;
      };
    }>
  > {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const queryString = params.toString();
    return this.request(
      `/analytics/dashboard${queryString ? `?${queryString}` : ""}`
    );
  }

  async getAuditLogs(
    page = 1,
    limit = 50,
    filters?: {
      action?: string;
      entityType?: string;
      userId?: string;
    }
  ): Promise<
    ApiResponse<{
      logs: Array<{
        id: string;
        action: string;
        entityType: string;
        entityId?: string;
        userId?: string;
        userEmail?: string;
        oldValues?: Record<string, any>;
        newValues?: Record<string, any>;
        ipAddress?: string;
        userAgent?: string;
        description?: string;
        createdAt: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>
  > {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (filters?.action) params.append("action", filters.action);
    if (filters?.entityType) params.append("entityType", filters.entityType);
    if (filters?.userId) params.append("userId", filters.userId);

    return this.request(`/admin/audit-logs?${params.toString()}`);
  }

  async updateUserStatus(
    id: string,
    status: string,
    reason?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/admin/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, reason }),
    });
  }

  async approveInstitution(
    id: string,
    status: string,
    reason?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/admin/institutions/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ status, reason }),
    });
  }

  // System settings endpoints for pricing management
  async getSystemSettings(): Promise<
    ApiResponse<{ settings: Record<string, any[]> }>
  > {
    return this.request("/admin/settings");
  }

  async saveSystemSetting(
    key: string,
    value: any,
    type: string,
    description?: string
  ): Promise<ApiResponse<{ setting: any; message: string }>> {
    return this.request("/admin/settings", {
      method: "POST",
      body: JSON.stringify({ key, value, type, description }),
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

  // Payment and Subscription endpoints
  async getUserSubscription(): Promise<
    ApiResponse<{
      id: string;
      userId: string;
      planId: string;
      status: "active" | "cancelled" | "expired" | "pending";
      currentPeriodStart: string;
      currentPeriodEnd: string;
      cancelAtPeriodEnd: boolean;
      plan: {
        id: string;
        name: string;
        price: number;
        currency: string;
        interval: "monthly" | "yearly";
        features: string[];
      };
      usage: {
        verificationsUsed: number;
        verificationsLimit: number;
      };
    }>
  > {
    return this.request("/subscriptions/current");
  }

  async getPaymentHistory(
    page = 1,
    limit = 20
  ): Promise<
    ApiResponse<{
      payments: Array<{
        id: string;
        amount: number;
        currency: string;
        status: "successful" | "failed" | "pending" | "refunded";
        description: string;
        paymentMethod: string;
        reference: string;
        createdAt: string;
        metadata?: Record<string, any>;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>
  > {
    return this.request(`/payments/history?page=${page}&limit=${limit}`);
  }

  async getPaymentAnalytics(timeframe: "7d" | "30d" | "90d" = "30d"): Promise<
    ApiResponse<{
      totalRevenue: number;
      totalTransactions: number;
      successRate: number;
      averageTransactionValue: number;
      revenueGrowth: number;
      topPaymentMethods: Array<{
        method: string;
        count: number;
        percentage: number;
      }>;
      revenueByPeriod: Array<{
        date: string;
        revenue: number;
        transactions: number;
      }>;
      geographicRevenue: Array<{
        country: string;
        revenue: number;
        transactions: number;
      }>;
      subscriptionMetrics: {
        activeSubscriptions: number;
        churnRate: number;
        mrr: number;
        arpu: number;
      };
    }>
  > {
    return this.request(`/payments/analytics?timeframe=${timeframe}`);
  }

  async cancelSubscription(reason?: string): Promise<
    ApiResponse<{
      subscription: {
        id: string;
        status: string;
        cancelAtPeriodEnd: boolean;
        currentPeriodEnd: string;
      };
      message: string;
    }>
  > {
    return this.request("/subscriptions/cancel", {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async reactivateSubscription(): Promise<
    ApiResponse<{
      subscription: {
        id: string;
        status: string;
        cancelAtPeriodEnd: boolean;
        currentPeriodEnd: string;
      };
      message: string;
    }>
  > {
    return this.request("/subscriptions/reactivate", {
      method: "POST",
    });
  }

  async updatePaymentMethod(paymentMethodId: string): Promise<
    ApiResponse<{
      paymentMethod: {
        id: string;
        type: string;
        last4?: string;
        brand?: string;
        expiryMonth?: number;
        expiryYear?: number;
      };
      message: string;
    }>
  > {
    return this.request("/payments/payment-method", {
      method: "PUT",
      body: JSON.stringify({ paymentMethodId }),
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): Promise<
    ApiResponse<{
      clientSecret: string;
      paymentIntentId: string;
    }>
  > {
    return this.request("/payments/create-intent", {
      method: "POST",
      body: JSON.stringify({ amount, currency, metadata }),
    });
  }

  async confirmPayment(paymentIntentId: string): Promise<
    ApiResponse<{
      payment: {
        id: string;
        status: string;
        amount: number;
        currency: string;
      };
      message: string;
    }>
  > {
    return this.request("/payments/confirm", {
      method: "POST",
      body: JSON.stringify({ paymentIntentId }),
    });
  }

  async getSubscriptionPlans(): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        description: string;
        price: number;
        currency: string;
        interval: "monthly" | "yearly";
        features: string[];
        popular?: boolean;
        verificationsLimit: number;
      }>
    >
  > {
    return this.request("/subscriptions/plans");
  }

  async upgradeSubscription(planId: string): Promise<
    ApiResponse<{
      subscription: {
        id: string;
        planId: string;
        status: string;
      };
      message: string;
    }>
  > {
    return this.request("/subscriptions/upgrade", {
      method: "POST",
      body: JSON.stringify({ planId }),
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
    forgotPassword: apiClient.forgotPassword.bind(apiClient),
    resetPassword: apiClient.resetPassword.bind(apiClient),
    verify2FA: apiClient.verify2FA.bind(apiClient),
    resend2FA: apiClient.resend2FA.bind(apiClient),

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
    getInstitution: apiClient.getInstitution.bind(apiClient),
    createInstitution: apiClient.createInstitution.bind(apiClient),
    updateInstitution: apiClient.updateInstitution.bind(apiClient),
    deleteInstitution: apiClient.deleteInstitution.bind(apiClient),
    getDashboardStats: apiClient.getDashboardStats.bind(apiClient),
    getAnalyticsDashboard: apiClient.getAnalyticsDashboard.bind(apiClient),
    getAuditLogs: apiClient.getAuditLogs.bind(apiClient),
    updateUserStatus: apiClient.updateUserStatus.bind(apiClient),
    approveInstitution: apiClient.approveInstitution.bind(apiClient),

    // System settings methods
    getSystemSettings: apiClient.getSystemSettings.bind(apiClient),
    saveSystemSetting: apiClient.saveSystemSetting.bind(apiClient),

    // Analytics
    getAnalytics: apiClient.getAnalytics.bind(apiClient),

    // Notifications
    getNotifications: apiClient.getNotifications.bind(apiClient),
    markNotificationRead: apiClient.markNotificationRead.bind(apiClient),

    // Payment and Subscription methods
    getUserSubscription: apiClient.getUserSubscription.bind(apiClient),
    getPaymentHistory: apiClient.getPaymentHistory.bind(apiClient),
    getPaymentAnalytics: apiClient.getPaymentAnalytics.bind(apiClient),
    cancelSubscription: apiClient.cancelSubscription.bind(apiClient),
    reactivateSubscription: apiClient.reactivateSubscription.bind(apiClient),
    updatePaymentMethod: apiClient.updatePaymentMethod.bind(apiClient),
    createPaymentIntent: apiClient.createPaymentIntent.bind(apiClient),
    confirmPayment: apiClient.confirmPayment.bind(apiClient),
    getSubscriptionPlans: apiClient.getSubscriptionPlans.bind(apiClient),
    upgradeSubscription: apiClient.upgradeSubscription.bind(apiClient),
  };
};
