"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AdminPricing } from "@/components/dashboard/admin-pricing";
import { Shield, Users, DollarSign, BarChart3, Settings } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "User Management", href: "/dashboard/users", icon: Users },
  { name: "Institutions", href: "/dashboard/institutions", icon: Shield },
  {
    name: "Pricing",
    href: "/dashboard/pricing",
    icon: DollarSign,
    current: true,
  },
  { name: "System Logs", href: "/dashboard/logs", icon: Settings },
];

export default function PricingPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <DashboardLayout navigation={navigation}>
        <AdminPricing />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
