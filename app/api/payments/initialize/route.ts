import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, amount, currency, reference, metadata } = body

    // In production, use environment variables for Paystack keys
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || "sk_test_your_secret_key"

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        currency,
        reference,
        metadata,
        callback_url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/verify/payment-callback`,
      }),
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ status: false, message: "Payment initialization failed" }, { status: 500 })
  }
}
