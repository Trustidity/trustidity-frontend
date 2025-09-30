"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface SessionTimeoutConfig {
  // Session timeout in milliseconds (default: 30 minutes)
  sessionTimeout: number;
  // Warning time before logout in milliseconds (default: 5 minutes)
  warningTime: number;
  // Check interval in milliseconds (default: 1 minute)
  checkInterval: number;
}

const DEFAULT_CONFIG: SessionTimeoutConfig = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  warningTime: 5 * 60 * 1000, // 5 minutes
  checkInterval: 60 * 1000, // 1 minute
};

export const useSessionTimeout = (
  config: Partial<SessionTimeoutConfig> = {}
) => {
  const { auth, logout } = useAuth();
  const router = useRouter();
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update last activity time
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
  }, []);

  // Handle session timeout
  const handleTimeout = useCallback(() => {
    logout();
    toast({
      title: "Session Expired",
      description: "Your session has timed out. Please log in again.",
      variant: "destructive",
    });
    router.push("/login");
  }, [logout, router]);

  // Show warning before timeout
  const showWarning = useCallback(() => {
    if (!warningShownRef.current) {
      warningShownRef.current = true;
      toast({
        title: "Session Expiring Soon",
        description:
          "Your session will expire in 5 minutes. Click anywhere to stay logged in.",
        variant: "default",
      });
    }
  }, []);

  // Check session status
  const checkSession = useCallback(() => {
    if (!auth.user || !auth.token) return;

    const now = Date.now();
    const timeSinceActivity = now - lastActivityRef.current;
    const timeUntilTimeout = finalConfig.sessionTimeout - timeSinceActivity;
    const timeUntilWarning =
      finalConfig.sessionTimeout - finalConfig.warningTime - timeSinceActivity;

    // Show warning if approaching timeout
    if (timeUntilWarning <= 0 && timeUntilTimeout > 0) {
      showWarning();
    }

    // Logout if session expired
    if (timeUntilTimeout <= 0) {
      handleTimeout();
    }
  }, [auth.user, auth.token, showWarning, handleTimeout]);

  // Activity event listeners
  useEffect(() => {
    if (!auth.user) return;

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => updateActivity();

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start checking session
    checkIntervalRef.current = setInterval(
      checkSession,
      finalConfig.checkInterval
    );

    return () => {
      // Remove event listeners
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });

      // Clear intervals
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [auth.user, updateActivity, checkSession]);

  // Reset activity on auth state change
  useEffect(() => {
    if (auth.user) {
      updateActivity();
    }
  }, [auth.user, updateActivity]);

  return {
    updateActivity,
    getRemainingTime: () => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      return Math.max(0, finalConfig.sessionTimeout - timeSinceActivity);
    },
    isWarningShown: () => warningShownRef.current,
  };
};
