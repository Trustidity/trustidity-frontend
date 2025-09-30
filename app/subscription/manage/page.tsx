"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { SubscriptionManagement } from "@/components/subscription/subscription-management";

export default function ManageSubscriptionPage() {
  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Manage Subscription
            </h1>
            <p className="text-muted-foreground">
              View and manage your subscription details
            </p>
          </div>
          <SubscriptionManagement />
        </div>
      </div>
    </ProtectedRoute>
  );
}
