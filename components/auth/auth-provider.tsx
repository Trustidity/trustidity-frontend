"use client";

import type React from "react";

import { AuthProvider } from "@/hooks/use-auth";
import { useSessionTimeout } from "@/hooks/use-session-timeout";

function SessionTimeoutWrapper({ children }: { children: React.ReactNode }) {
  useSessionTimeout({
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    warningTime: 5 * 60 * 1000, // 5 minutes warning
    checkInterval: 60 * 1000, // Check every minute
  });

  return <>{children}</>;
}

export function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SessionTimeoutWrapper>{children}</SessionTimeoutWrapper>
    </AuthProvider>
  );
}
