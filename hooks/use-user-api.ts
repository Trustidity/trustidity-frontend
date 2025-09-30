// hooks/use-user-api.tsx or similar file path
"use client";

import { useCallback, useMemo } from "react";
import { getToken } from "@/lib/auth";
import type { ApiResponse, User } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class UserApiClient {
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
        if (response.status === 429) {
          return {
            success: false,
            error: "Too many requests. Please try again later.",
          };
        }
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

  async getUsers(
    page = 1,
    limit = 20,
    search?: string,
    role?: string,
    status?: string
  ): Promise<ApiResponse<{ users: User[]; pagination: any }>> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (role) params.append("role", role);
    if (status) params.append("status", status);

    return this.request(`/admin/users?${params.toString()}`);
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

  async suspendUser(
    id: string,
    reason?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.updateUserStatus(id, "suspended", reason);
  }

  async activateUser(
    id: string,
    reason?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.updateUserStatus(id, "active", reason);
  }
}

const userApiClient = new UserApiClient(API_BASE_URL);

export const useUserApi = () => {
  const getUsers = useCallback(
    (page = 1, limit = 20, search?: string, role?: string, status?: string) =>
      userApiClient.getUsers(page, limit, search, role, status),
    []
  );

  const getUser = useCallback((id: string) => userApiClient.getUser(id), []);

  const updateUser = useCallback(
    (id: string, updates: Partial<User>) =>
      userApiClient.updateUser(id, updates),
    []
  );

  const deleteUser = useCallback(
    (id: string) => userApiClient.deleteUser(id),
    []
  );

  const updateUserStatus = useCallback(
    (id: string, status: string, reason?: string) =>
      userApiClient.updateUserStatus(id, status, reason),
    []
  );

  const suspendUser = useCallback(
    (id: string, reason?: string) => userApiClient.suspendUser(id, reason),
    []
  );

  const activateUser = useCallback(
    (id: string, reason?: string) => userApiClient.activateUser(id, reason),
    []
  );

  return useMemo(
    () => ({
      getUsers,
      getUser,
      updateUser,
      deleteUser,
      updateUserStatus,
      suspendUser,
      activateUser,
      // Alias for consistency
      editUser: updateUser,
    }),
    [
      getUsers,
      getUser,
      updateUser,
      deleteUser,
      updateUserStatus,
      suspendUser,
      activateUser,
    ]
  );
};
