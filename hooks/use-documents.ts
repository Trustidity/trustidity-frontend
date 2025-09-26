"use client"

import { useState, useEffect } from "react"
import { useApi } from "./use-api" 
import type { Document, ApiResponse } from "@/lib/types"

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const api = useApi()

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response: ApiResponse<Document[]> = await api.getDocuments()
      if (response.success && response.data) {
        setDocuments(response.data)
      } else {
        setError(response.error || "Failed to fetch documents")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const uploadDocument = async (file: File, documentType: string) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", documentType)

      const response: ApiResponse<Document> = await api.uploadDocument(formData)
      if (response.success && response.data) {
        setDocuments((prev) => [response.data!, ...prev])
        return response.data
      } else {
        throw new Error(response.error || "Upload failed")
      }
    } catch (err) {
      throw err
    }
  }

  const deleteDocument = async (documentId: string) => {
    try {
      const response: ApiResponse<void> = await api.deleteDocument(documentId)
      if (response.success) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
      } else {
        throw new Error(response.error || "Delete failed")
      }
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  return {
    documents,
    isLoading,
    error,
    uploadDocument,
    deleteDocument,
    refetch: fetchDocuments,
  }
}
