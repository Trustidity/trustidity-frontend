"use client"

import { useState } from "react"
import { useApi } from "./use-api"
import type { VerificationResult, ApiResponse } from "@/lib/types"

export function useVerification() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const api = useApi()

  const verifyDocument = async (referenceNumber: string) => {
    try {
      setIsVerifying(true)
      setError(null)
      setVerificationResult(null)

      const response: ApiResponse<VerificationResult> = await api.verifyDocument(referenceNumber)
      if (response.success && response.data) {
        setVerificationResult(response.data)
        return response.data
      } else {
        setError(response.error || "Verification failed")
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      return null
    } finally {
      setIsVerifying(false)
    }
  }

  const clearResults = () => {
    setVerificationResult(null)
    setError(null)
  }

  return {
    verifyDocument,
    isVerifying,
    verificationResult,
    error,
    clearResults,
  }
}
