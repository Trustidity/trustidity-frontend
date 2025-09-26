"use client";

import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { IndividualDashboard } from "@/components/dashboard/individual-dashboard";
import { EmployerDashboard } from "@/components/dashboard/employer-dashboard";
import { InstitutionDashboard } from "@/components/dashboard/institution-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default function DashboardPage() {
  const { auth } = useAuth();

  const renderDashboard = () => {
    switch (auth.user?.role) {
      case "user":
        return <IndividualDashboard />;
      case "employer":
        return <EmployerDashboard />;
      case "institution_admin":
        return <InstitutionDashboard />;
      case "admin":
        return <AdminDashboard />;
      case "super_admin":
        return <AdminDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return <ProtectedRoute>{renderDashboard()}</ProtectedRoute>;
}
