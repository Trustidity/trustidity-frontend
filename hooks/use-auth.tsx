"use client";

import type React from "react";
import { useState, useEffect, createContext, useContext } from "react";
import {
  type AuthState,
  getToken,
  setToken,
  removeToken,
  isTokenExpired,
} from "@/lib/auth";
import { useApi } from "@/hooks/use-api";

const AuthContext = createContext<{
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });
  const api = useApi();

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      if (data.success && data.data) {
        return data.data;
      }

      throw new Error("Invalid user data response");
    } catch (error) {
      console.error("[v0] Failed to fetch current user:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("[v0] Initializing auth...");
      const token = getToken();

      if (!token) {
        console.log("[v0] No token found");
        setAuth({ user: null, token: null, isLoading: false });
        return;
      }

      if (isTokenExpired(token)) {
        console.log("[v0] Token expired, removing...");
        removeToken();
        setAuth({ user: null, token: null, isLoading: false });
        return;
      }

      try {
        console.log("[v0] Token valid, fetching user data...");
        const userData = await fetchCurrentUser(token);

        console.log("[v0] User data fetched successfully:", userData);
        setAuth({
          user: {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            organization: userData.organization,
            institutionId: userData.institutionId || null,
            companyId: userData.companyId || null,
            role: userData.role,
            status: userData.status || "active",
            emailVerified: userData.emailVerified || false,
            createdAt: userData.createdAt || new Date().toISOString(),
          },
          token,
          isLoading: false,
        });
      } catch (error) {
        console.error("[v0] Auth initialization failed:", error);
        removeToken();
        setAuth({ user: null, token: null, isLoading: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);

    if (!response.success) {
      throw new Error(response.error || "Login failed");
    }

    if (!response.data) {
      throw new Error("Invalid response from server");
    }

    const { user, tokens } = response.data;

    if (!user || !tokens || !tokens.accessToken) {
      throw new Error("Invalid authentication response");
    }

    const accessToken = tokens.accessToken;

    setToken(accessToken);
    setAuth({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        organization: user.organization,
        institutionId: user.institutionId,
        companyId: user.companyId,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      token: accessToken,
      isLoading: false,
    });
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string
  ) => {
    const response = await api.register(
      email,
      password,
      firstName,
      lastName,
      role
    );

    if (!response.success) {
      throw new Error(response.error || "Registration failed");
    }

    if (!response.data) {
      throw new Error("Invalid response from server");
    }

    const { user, tokens } = response.data;

    if (!user || !tokens || !tokens.accessToken) {
      throw new Error("Invalid authentication response");
    }

    const accessToken = tokens.accessToken;

    setToken(accessToken);
    setAuth({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        organization: user.organization,
        // institutionId: user.institutionId || "",
        // companyId: user.companyId || "",
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      token: accessToken,
      isLoading: false,
    });
  };

  const logout = () => {
    console.log("[v0] Logging out...");
    removeToken();
    setAuth({ user: null, token: null, isLoading: false });
    if (typeof window !== "undefined") {
      // Clear any additional session data if needed
      sessionStorage.clear();
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
