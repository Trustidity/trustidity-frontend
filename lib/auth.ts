// Authentication utilities and types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  organization?: string;
  role: "user" | "institution_admin" | "super_admin" | "admin" | "employer";
  status: "active" | "inactive" | "suspended";
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

// JWT token utilities
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("trustidity_token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("trustidity_token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("trustidity_token");
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
