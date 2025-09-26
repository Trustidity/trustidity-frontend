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

  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setAuth({
          user: {
            id: payload.userId,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            phoneNumber: payload.phoneNumber,
            organization: payload.organization,
            role: payload.role,
            status: payload.status || "active",
            emailVerified: payload.emailVerified || false,
            createdAt: payload.createdAt || new Date().toISOString(),
          },
          token,
          isLoading: false,
        });
      } catch {
        removeToken();
        setAuth({ user: null, token: null, isLoading: false });
      }
    } else {
      setAuth({ user: null, token: null, isLoading: false });
    }
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
    removeToken();
    setAuth({ user: null, token: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
