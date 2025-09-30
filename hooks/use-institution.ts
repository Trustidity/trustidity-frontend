"use client"

import { useState, useCallback } from "react"
import { useApi } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"
import type { Institution } from "@/lib/types"

interface InstitutionFilters {
  search?: string
  status?: string
  type?: string
}

interface InstitutionStats {
  totalInstitutions: number
  activeInstitutions: number
  universities: number
  totalStudents: number
  pendingApprovals: number
}

interface UseInstitutionReturn {
  // Data
  institutions: Institution[]
  institutionStats: InstitutionStats
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number

  // Actions
  fetchInstitutions: (page?: number, filters?: InstitutionFilters) => Promise<void>
  createInstitution: (institutionData: Omit<Institution, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateInstitution: (id: string, updates: Partial<Institution>) => Promise<boolean>
  deleteInstitution: (id: string) => Promise<boolean>
  approveInstitution: (id: string, status: string, reason?: string) => Promise<boolean>
  getInstitution: (id: string) => Promise<Institution | null>

  // Utility
  refreshInstitutions: () => Promise<void>
  resetError: () => void
}

export const useInstitution = (): UseInstitutionReturn => {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [institutionStats, setInstitutionStats] = useState<InstitutionStats>({
    totalInstitutions: 0,
    activeInstitutions: 0,
    universities: 0,
    totalStudents: 0,
    pendingApprovals: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [currentFilters, setCurrentFilters] = useState<InstitutionFilters>({})

  const api = useApi()
  const { toast } = useToast()

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  const fetchInstitutions = useCallback(
    async (page = 1, filters: InstitutionFilters = {}) => {
      try {
        setLoading(true)
        setError(null)
        setCurrentFilters(filters)

        const response = await api.getInstitutions(page, 20, filters.search, filters.status, filters.type)

        if (response.success && response.data) {
          setInstitutions(response.data.institutions)
          setCurrentPage(response.data.pagination.page)
          setTotalPages(response.data.pagination.pages)

          // Calculate stats from the institutions data
          const stats = response.data.institutions.reduce(
            (acc, institution) => {
              acc.totalInstitutions++
              if (institution.status === "active") acc.activeInstitutions++
              if (institution.type.toLowerCase().includes("university")) acc.universities++
              if (institution.status === "pending") acc.pendingApprovals++
              return acc
            },
            {
              totalInstitutions: 0,
              activeInstitutions: 0,
              universities: 0,
              totalStudents: 0, // This would need to come from a separate endpoint
              pendingApprovals: 0,
            },
          )
          setInstitutionStats(stats)
        } else {
          const errorMessage = response.error || "Failed to fetch institutions"
          setError(errorMessage)
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [api, toast],
  )

  const createInstitution = useCallback(
    async (institutionData: Omit<Institution, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
      try {
        setLoading(true)
        const response = await api.createInstitution(institutionData)

        if (response.success) {
          toast({
            title: "Success",
            description: "Institution created successfully",
          })
          // Refresh the list to show the new institution
          await fetchInstitutions(1, currentFilters)
          return true
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to create institution",
            variant: "destructive",
          })
          return false
        }
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to create institution",
          variant: "destructive",
        })
        return false
      } finally {
        setLoading(false)
      }
    },
    [api, toast, fetchInstitutions, currentFilters],
  )

  const updateInstitution = useCallback(
    async (id: string, updates: Partial<Institution>): Promise<boolean> => {
      try {
        setLoading(true)
        const response = await api.updateInstitution(id, updates)

        if (response.success) {
          toast({
            title: "Success",
            description: "Institution updated successfully",
          })
          // Refresh the current page
          await fetchInstitutions(currentPage, currentFilters)
          return true
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to update institution",
            variant: "destructive",
          })
          return false
        }
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to update institution",
          variant: "destructive",
        })
        return false
      } finally {
        setLoading(false)
      }
    },
    [api, toast, fetchInstitutions, currentPage, currentFilters],
  )

  const deleteInstitution = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true)
        const response = await api.deleteInstitution(id)

        if (response.success) {
          toast({
            title: "Success",
            description: "Institution deleted successfully",
          })
          // Refresh the current page
          await fetchInstitutions(currentPage, currentFilters)
          return true
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to delete institution",
            variant: "destructive",
          })
          return false
        }
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to delete institution",
          variant: "destructive",
        })
        return false
      } finally {
        setLoading(false)
      }
    },
    [api, toast, fetchInstitutions, currentPage, currentFilters],
  )

  const approveInstitution = useCallback(
    async (id: string, status: string, reason?: string): Promise<boolean> => {
      try {
        setLoading(true)
        const response = await api.approveInstitution(id, status, reason)

        if (response.success) {
          toast({
            title: "Success",
            description: response.message || `Institution ${status === "active" ? "approved" : "updated"} successfully`,
          })
          // Refresh the current page
          await fetchInstitutions(currentPage, currentFilters)
          return true
        } else {
          toast({
            title: "Error",
            description: response.error || `Failed to ${status === "active" ? "approve" : "update"} institution`,
            variant: "destructive",
          })
          return false
        }
      } catch (err) {
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : `Failed to ${status === "active" ? "approve" : "update"} institution`,
          variant: "destructive",
        })
        return false
      } finally {
        setLoading(false)
      }
    },
    [api, toast, fetchInstitutions, currentPage, currentFilters],
  )

  const getInstitution = useCallback(
    async (id: string): Promise<Institution | null> => {
      try {
        const response = await api.getInstitution(id)

        if (response.success && response.data) {
          return response.data
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to fetch institution details",
            variant: "destructive",
          })
          return null
        }
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to fetch institution details",
          variant: "destructive",
        })
        return null
      }
    },
    [api, toast],
  )

  const refreshInstitutions = useCallback(async () => {
    await fetchInstitutions(currentPage, currentFilters)
  }, [fetchInstitutions, currentPage, currentFilters])

  return {
    // Data
    institutions,
    institutionStats,
    loading,
    error,
    currentPage,
    totalPages,

    // Actions
    fetchInstitutions,
    createInstitution,
    updateInstitution,
    deleteInstitution,
    approveInstitution,
    getInstitution,

    // Utility
    refreshInstitutions,
    resetError,
  }
}
