"use client";

import { useState, useCallback } from "react";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

interface PaymentData {
  email: string;
  amount: number;
  currency: "NGN" | "USD";
  reference: string;
  metadata: Record<string, any>;
}

interface PaymentResult {
  success: boolean;
  reference?: string;
  authorization_url?: string;
  data?: any;
  message?: string;
}

interface UsePaymentsReturn {
  // Payment processing
  initializePayment: (data: PaymentData) => Promise<PaymentResult>;
  verifyPayment: (reference: string) => Promise<PaymentResult>;

  // Subscription management
  cancelSubscription: () => Promise<{ success: boolean; error?: string }>;
  reactivateSubscription: () => Promise<{ success: boolean; error?: string }>;

  // State
  processing: boolean;
  error: string | null;

  // Utility
  resetError: () => void;
}

export const usePayments = (): UsePaymentsReturn => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = useApi();
  const { toast } = useToast();

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const initializePayment = useCallback(
    async (data: PaymentData): Promise<PaymentResult> => {
      try {
        setProcessing(true);
        setError(null);

        const response = await fetch("/api/payments/initialize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to initialize payment");
        }

        const result = await response.json();

        if (result.success) {
          toast({
            title: "Payment Initialized",
            description: "Redirecting to payment gateway...",
          });
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Payment initialization failed";
        setError(errorMessage);
        toast({
          title: "Payment Error",
          description: errorMessage,
          variant: "destructive",
        });
        return { success: false, message: errorMessage };
      } finally {
        setProcessing(false);
      }
    },
    [toast]
  );

  const verifyPayment = useCallback(
    async (reference: string): Promise<PaymentResult> => {
      try {
        setProcessing(true);
        setError(null);

        const response = await fetch(`/api/payments/verify/${reference}`);

        if (!response.ok) {
          throw new Error("Failed to verify payment");
        }

        const result = await response.json();

        if (result.success) {
          toast({
            title: "Payment Verified",
            description: "Your payment has been confirmed successfully",
          });
        } else {
          toast({
            title: "Payment Failed",
            description: result.message || "Payment verification failed",
            variant: "destructive",
          });
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Payment verification failed";
        setError(errorMessage);
        toast({
          title: "Verification Error",
          description: errorMessage,
          variant: "destructive",
        });
        return { success: false, message: errorMessage };
      } finally {
        setProcessing(false);
      }
    },
    [toast]
  );

  const cancelSubscription = useCallback(async () => {
    try {
      setProcessing(true);
      setError(null);

      const response = await api.cancelSubscription();

      if (response.success) {
        toast({
          title: "Subscription Cancelled",
          description: "Your subscription has been cancelled successfully",
        });
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to cancel subscription";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setProcessing(false);
    }
  }, [api, toast]);

  const reactivateSubscription = useCallback(async () => {
    try {
      setProcessing(true);
      setError(null);

      const response = await api.reactivateSubscription();

      if (response.success) {
        toast({
          title: "Subscription Reactivated",
          description: "Your subscription has been reactivated successfully",
        });
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to reactivate subscription";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setProcessing(false);
    }
  }, [api, toast]);

  return {
    // Payment processing
    initializePayment,
    verifyPayment,

    // Subscription management
    cancelSubscription,
    reactivateSubscription,

    // State
    processing,
    error,

    // Utility
    resetError,
  };
};
