"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Calendar,
  Users,
  Building,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Settings,
} from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/geolocation";

interface Subscription {
  id: string;
  planType: "individual" | "employer" | "government";
  planName: string;
  status: "active" | "cancelled" | "expired" | "pending";
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  amount: number;
  currency: "NGN" | "USD";
  verificationLimit: number;
  verificationsUsed: number;
  autoRenew: boolean;
  paymentMethod: {
    type: string;
    last4: string;
    brand: string;
  };
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  currency: "NGN" | "USD";
  status: "success" | "failed" | "pending";
  description: string;
  reference: string;
}

const planIcons = {
  individual: Users,
  employer: Building,
  government: Globe,
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
};

export function SubscriptionManagement() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = useApi();
  const { toast } = useToast();

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [subscriptionResponse, historyResponse] = await Promise.all([
        api.getUserSubscription(),
        api.getPaymentHistory(),
      ]);

      if (subscriptionResponse.success && subscriptionResponse.data) {
        setSubscription(subscriptionResponse.data);
      }

      if (historyResponse.success && historyResponse.data) {
        setPaymentHistory(historyResponse.data.payments || []);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load subscription data";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      const response = await api.cancelSubscription();

      if (response.success) {
        setSubscription((prev) =>
          prev ? { ...prev, status: "cancelled", autoRenew: false } : null
        );
        toast({
          title: "Success",
          description: "Subscription cancelled successfully",
        });
      } else {
        throw new Error(response.error || "Failed to cancel subscription");
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription) return;

    try {
      const response = await api.reactivateSubscription();

      if (response.success) {
        setSubscription((prev) =>
          prev ? { ...prev, status: "active", autoRenew: true } : null
        );
        toast({
          title: "Success",
          description: "Subscription reactivated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to reactivate subscription");
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to reactivate subscription",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Failed to Load Subscription
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchSubscriptionData}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Active Subscription
            </h3>
            <p className="text-muted-foreground mb-4">
              You don't have an active subscription yet.
            </p>
            <Button>Choose a Plan</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const PlanIcon = planIcons[subscription.planType];
  const usagePercentage =
    (subscription.verificationsUsed / subscription.verificationLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <PlanIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{subscription.planName}</CardTitle>
                <CardDescription>Current subscription plan</CardDescription>
              </div>
            </div>
            <Badge className={statusColors[subscription.status]}>
              {subscription.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Monthly Cost
                </span>
                <span className="font-semibold">
                  {formatCurrency(subscription.amount, subscription.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Next Billing
                </span>
                <span className="font-semibold">
                  {new Date(subscription.nextBillingDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Auto Renew
                </span>
                <span className="font-semibold">
                  {subscription.autoRenew ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Verifications Used
                </span>
                <span className="font-semibold">
                  {subscription.verificationsUsed} /{" "}
                  {subscription.verificationLimit}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {subscription.verificationLimit -
                  subscription.verificationsUsed}{" "}
                remaining
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Payment Method
                </span>
                <span className="font-semibold">
                  {subscription.paymentMethod.brand} ••••{" "}
                  {subscription.paymentMethod.last4}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Plan Started
                </span>
                <span className="font-semibold">
                  {new Date(subscription.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Manage Plan
              </Button>
              <Button variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Update Payment
              </Button>
            </div>
            <div className="flex space-x-2">
              {subscription.status === "active" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancelSubscription}
                >
                  Cancel Subscription
                </Button>
              ) : (
                <Button size="sm" onClick={handleReactivateSubscription}>
                  Reactivate
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Your recent payment transactions
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSubscriptionData}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paymentHistory.length > 0 ? (
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-lg">
                      {payment.status === "success" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : payment.status === "failed" ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{payment.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString()} • Ref:{" "}
                        {payment.reference}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                    <Badge
                      variant={
                        payment.status === "success" ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Payment History
              </h3>
              <p className="text-muted-foreground">
                Your payment transactions will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
