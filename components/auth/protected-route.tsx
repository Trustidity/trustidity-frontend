"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { auth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      router.push("/login")
    }

    if (auth.user && allowedRoles && !allowedRoles.includes(auth.user.role)) {
      router.push("/unauthorized")
    }
  }, [auth, router, allowedRoles])

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!auth.user) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
