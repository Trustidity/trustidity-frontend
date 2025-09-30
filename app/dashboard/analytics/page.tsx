"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AnalyticsDashboard />
    </ProtectedRoute>
  );
}
