// Authentication utilities and types
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
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return payload.exp * 1000 < Date.now() + bufferTime;
  } catch {
    return true;
  }
};

export const getLastActivity = (): number => {
  if (typeof window === "undefined") return Date.now();
  const stored = localStorage.getItem("trustidity_last_activity");
  return stored ? Number.parseInt(stored, 10) : Date.now();
};

export const setLastActivity = (timestamp: number): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("trustidity_last_activity", timestamp.toString());
};

export const removeLastActivity = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("trustidity_last_activity");
};
