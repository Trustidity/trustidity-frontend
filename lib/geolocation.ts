export interface LocationInfo {
  country: string
  currency: "NGN" | "USD"
  countryCode: string
}

export async function detectUserLocation(): Promise<LocationInfo> {
  try {
    // Try to get user's location from IP
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()

    // Check if user is from Nigeria
    const isNigeria = data.country_code === "NG" || data.country === "Nigeria"

    return {
      country: data.country || "Unknown",
      currency: isNigeria ? "NGN" : "USD",
      countryCode: data.country_code || "XX",
    }
  } catch (error) {
    console.error("Failed to detect location:", error)
    // Default to USD for international users
    return {
      country: "Unknown",
      currency: "USD",
      countryCode: "XX",
    }
  }
}

export function formatCurrency(amount: number, currency: "NGN" | "USD"): string {
  return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}
