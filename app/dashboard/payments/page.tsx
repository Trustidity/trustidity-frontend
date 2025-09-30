"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { PaymentAnalytics } from "@/components/payments/payment-analytics";

export default function PaymentsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <PaymentAnalytics />
    </ProtectedRoute>
  );
}
