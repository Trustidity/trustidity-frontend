// Global error handling utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred"
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && (error.message.includes("fetch") || error.message.includes("network"))
}

export function isAuthError(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 401 || error.status === 403)
}

// Toast notification helper
export function showErrorToast(error: unknown) {
  const message = handleApiError(error)
  // In a real app, you'd integrate with your toast library here
  console.error("Error:", message)
}

export function showSuccessToast(message: string) {
  // In a real app, you'd integrate with your toast library here
  console.log("Success:", message)
}
