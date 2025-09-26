"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, MapPin, Shield, ArrowLeft } from "lucide-react"
import { detectUserLocation, formatCurrency, type LocationInfo } from "@/lib/geolocation"
import { getPriceForCredential } from "@/lib/pricing"
import { initializePayment, convertToSmallestUnit } from "@/lib/paystack"

interface PaymentStepProps {
  credentialType: string
  credentialName: string
  formData: Record<string, string>
  onBack: () => void
  onPaymentSuccess: (reference: string) => void
}

export function PaymentStep({ credentialType, credentialName, formData, onBack, onPaymentSuccess }: PaymentStepProps) {
  const [location, setLocation] = useState<LocationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  useEffect(() => {
    detectUserLocation().then((locationInfo) => {
      setLocation(locationInfo)
      setIsLoading(false)
    })
  }, [])

  const handlePayment = async () => {
    if (!location) return

    setIsProcessingPayment(true)

    try {
      const price = getPriceForCredential(credentialType, location.currency)
      const reference = `TRU_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const paymentData = {
        email: formData.email || "user@example.com",
        amount: convertToSmallestUnit(price, location.currency),
        currency: location.currency,
        reference,
        metadata: {
          credentialType,
          verificationId: `VER_${Date.now()}`,
          candidateName: formData.candidateName,
        },
      }

      const response = await initializePayment(paymentData)

      if (response.status) {
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment initialization failed. Please try again.")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3">Detecting your location...</span>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <p>Unable to detect location. Please try again.</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const price = getPriceForCredential(credentialType, location.currency)

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Form
          </Button>

          <h1 className="text-2xl font-bold text-foreground mb-2">Complete Payment</h1>
          <p className="text-muted-foreground">Secure payment to verify your credential</p>
        </div>

        <div className="space-y-6">
          {/* Location Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Location Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{location.country}</p>
                  <p className="text-sm text-muted-foreground">Pricing in {location.currency}</p>
                </div>
                <Badge variant="outline">{location.countryCode}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your verification request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Service</span>
                <span>{credentialName}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Candidate</span>
                <span>{formData.candidateName}</span>
              </div>

              {formData.institution && (
                <div className="flex justify-between">
                  <span className="font-medium">Institution</span>
                  <span>{formData.institution}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(price, location.currency)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Security */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-green-600" />
                  Secure Payment
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                  Powered by Paystack
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Button */}
          <Button onClick={handlePayment} className="w-full" size="lg" disabled={isProcessingPayment}>
            {isProcessingPayment ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay {formatCurrency(price, location.currency)}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By proceeding, you agree to our Terms of Service and Privacy Policy. Your payment is secure and encrypted.
          </p>
        </div>
      </div>
    </div>
  )
}
