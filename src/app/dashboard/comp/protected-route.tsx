"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/firebase/authContext"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireLead?: boolean
  requireEmployee?: boolean
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireLead = false,
  requireEmployee = false,
}: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      console.log("Protected route check:", { user, userData, requireAuth, requireLead, requireEmployee })

      if (requireAuth && !user) {
        console.log("Not authenticated, redirecting to home")
        router.push("/")
      } else if (user && userData) {
        if (requireLead && !userData.isLead) {
          console.log("User is not a lead but lead access is required, redirecting to employee dashboard")
          router.push("/employee/dashboard")
        } else if (requireEmployee && userData.isLead) {
          console.log("User is a lead but employee access is required, redirecting to lead dashboard")
          router.push("/lead/dashboard")
        } else {
          // If authenticated but not in the appropriate role route
          if (userData.isLead && !pathname.startsWith("/lead")) {
            console.log("Redirecting to lead dashboard")
            router.push("/lead/dashboard")
          } else if (!userData.isLead && !pathname.startsWith("/employee")) {
            console.log("Redirecting to employee dashboard")
            router.push("/employee/dashboard")
          }
        }
      }
    }
  }, [user, userData, loading, requireAuth, requireLead, requireEmployee, router, pathname])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (requireAuth && !user) {
    return null
  }

  if (requireLead && userData && !userData.isLead) {
    return null
  }

  if (requireEmployee && userData && userData.isLead) {
    return null
  }

  return <>{children}</>
}
