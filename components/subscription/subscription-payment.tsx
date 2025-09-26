"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, MapPin, Shield, ArrowLeft, Check } from "lucide-react"
import { detectUserLocation, formatCurrency, type LocationInfo } from "@/lib/geolocation"
import { initializePayment, convertToSmallestUnit } from "@/lib/paystack"

const planDetails = {
  individual: {
    name: "Individual Verification",
    priceNGN: 2500,
    priceUSD: 5,
    period: "per verification",
    features: [
      "Instant credential verification",
      "WAEC, JAMB, NECO certificates",
      "University degree verification",
      "Digital verification certificate",
      "24/7 online access",
      "Email support",
    ],
  },
  employer: {
    name: "Employer Package",
    priceNGN: 15000,
    priceUSD: 30,
    period: "for 10 verifications",
    features: [
      "Bulk verification discounts",
      "Priority processing",
      "Detailed verification reports",
      "API access for integration",
      "Team dashboard access",
      "Phone & email support",
      "90-day result storage",
    ],
  },
  government: {
    name: "Embassy/Government",
    priceNGN: 50000,
    priceUSD: 100,
    period: "monthly unlimited",
    features: [
      "Unlimited verifications",
      "Diplomatic-grade security",
      "Multi-language support",
      "Batch processing tools",
      "Advanced fraud detection",
      "Dedicated support line",
      "Compliance reporting",
    ],
  },
}

const planMapping: Record<string, keyof typeof planDetails> = {
  individual: "individual",
  individuals: "individual",
  employer: "employer",
  employers: "employer",
  government: "government",
  embassy: "government",
  "embassy-government": "government",
}

export function SubscriptionPayment() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planParam = searchParams.get("plan")

  const planType = planParam ? planMapping[planParam.toLowerCase()] : null

  const [location, setLocation] = useState<LocationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    organization: "",
    phone: "",
  })

  useEffect(() => {
    detectUserLocation().then((locationInfo) => {
      setLocation(locationInfo)
      setIsLoading(false)
    })
  }, [])

  const plan = planType ? planDetails[planType] : null

  if (!plan || !planType) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Plan</h1>
          <p className="text-muted-foreground mb-6">
            The selected plan "{planParam}" was not found. Please select a valid plan.
          </p>
          <Button onClick={() => router.push("/pricing")}>Back to Pricing</Button>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePayment = async () => {
    if (!location || !formData.email || !formData.fullName) {
      alert("Please fill in all required fields")
      return
    }

    setIsProcessingPayment(true)

    try {
      const price = location.currency === "NGN" ? plan.priceNGN : plan.priceUSD
      const reference = `TRU_SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const paymentData = {
        email: formData.email,
        amount: convertToSmallestUnit(price, location.currency),
        currency: location.currency,
        reference,
        metadata: {
          planType,
          planName: plan.name,
          fullName: formData.fullName,
          organization: formData.organization,
          phone: formData.phone,
          subscriptionType: "plan_purchase",
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
              <span className="ml-3">Loading...</span>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const price = location?.currency === "NGN" ? plan.priceNGN : plan.priceUSD

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/pricing")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pricing
          </Button>

          <h1 className="text-2xl font-bold text-foreground mb-2">Subscribe to {plan.name}</h1>
          <p className="text-muted-foreground">Complete your subscription to get started</p>
        </div>

        <div className="space-y-6">
          {/* Location Info */}
          {location && (
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
          )}

          {/* Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold text-primary">
                  {location ? formatCurrency(price, location.currency) : `₦${plan.priceNGN} / $${plan.priceUSD}`}
                </span>
                <span className="text-sm ml-2">{plan.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>We'll use this information for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => handleInputChange("organization", e.target.value)}
                    placeholder="Company/Institution name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>
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
          <Button
            onClick={handlePayment}
            className="w-full"
            size="lg"
            disabled={isProcessingPayment || !formData.email || !formData.fullName}
          >
            {isProcessingPayment ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Subscribe for{" "}
                {location ? formatCurrency(price, location.currency) : `₦${plan.priceNGN} / $${plan.priceUSD}`}
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
