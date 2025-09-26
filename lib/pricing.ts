export interface PricingConfig {
  id: string
  credentialType: string
  priceNGN: number
  priceUSD: number
  description: string
  isActive: boolean
}

// Default pricing configuration
export const DEFAULT_PRICING: PricingConfig[] = [
  {
    id: "1",
    credentialType: "waec",
    priceNGN: 2000,
    priceUSD: 5,
    description: "WAEC Certificate Verification",
    isActive: true,
  },
  {
    id: "2",
    credentialType: "jamb",
    priceNGN: 1500,
    priceUSD: 4,
    description: "JAMB Result Verification",
    isActive: true,
  },
  {
    id: "3",
    credentialType: "neco",
    priceNGN: 2000,
    priceUSD: 5,
    description: "NECO Certificate Verification",
    isActive: true,
  },
  {
    id: "4",
    credentialType: "university",
    priceNGN: 3000,
    priceUSD: 8,
    description: "University Degree Verification",
    isActive: true,
  },
  {
    id: "5",
    credentialType: "nmcn",
    priceNGN: 2500,
    priceUSD: 6,
    description: "NMCN Registration Verification",
    isActive: true,
  },
  {
    id: "6",
    credentialType: "nysc",
    priceNGN: 1500,
    priceUSD: 4,
    description: "NYSC Certificate Verification",
    isActive: true,
  },
  {
    id: "7",
    credentialType: "professional",
    priceNGN: 3500,
    priceUSD: 9,
    description: "Professional Certificate Verification",
    isActive: true,
  },
]

export function getPriceForCredential(credentialType: string, currency: "NGN" | "USD"): number {
  const pricing = DEFAULT_PRICING.find((p) => p.credentialType === credentialType)
  if (!pricing) return currency === "NGN" ? 2000 : 5 // Default price

  return currency === "NGN" ? pricing.priceNGN : pricing.priceUSD
}
