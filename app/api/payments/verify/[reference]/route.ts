import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { reference: string } }) {
  try {
    const { reference } = params
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || "sk_test_your_secret_key"

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ status: false, message: "Payment verification failed" }, { status: 500 })
  }
}
