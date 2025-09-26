export interface PaystackConfig {
  publicKey: string;
  secretKey: string;
}

export interface PaymentData {
  email: string;
  amount: number; // in kobo for NGN, cents for USD
  currency: "NGN" | "USD";
  reference: string;
  metadata: {
    // For credential verification
    credentialType?: string;
    verificationId?: string;
    userId?: string;
    // For subscription payments
    planType?: string;
    planName?: string;
    fullName?: string;
    organization?: string;
    phone?: string;
    subscriptionType?: string;
  };
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

// Initialize Paystack payment
export async function initializePayment(
  paymentData: PaymentData
): Promise<PaystackResponse> {
  try {
    const response = await fetch("/api/payments/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error("Failed to initialize payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Payment initialization error:", error);
    throw error;
  }
}

// Verify payment status
export async function verifyPayment(reference: string): Promise<any> {
  try {
    const response = await fetch(`/api/payments/verify/${reference}`);

    if (!response.ok) {
      throw new Error("Failed to verify payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Payment verification error:", error);
    throw error;
  }
}

// Convert amount to smallest currency unit (kobo/cents)
export function convertToSmallestUnit(
  amount: number,
  currency: "NGN" | "USD"
): number {
  return Math.round(amount * 100); // Both NGN and USD use 100 subunits
}
