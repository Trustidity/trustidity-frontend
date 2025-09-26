import { Suspense } from "react"
import { SubscriptionPayment } from "@/components/subscription/subscription-payment"

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <SubscriptionPayment />
      </Suspense>
    </div>
  )
}
