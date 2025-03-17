"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  // Check if user is a job provider and redirect if not
  useEffect(() => {
    if (user && user.role !== "provider") {
      router.push("/dashboard")
    }
  }, [user, router])

  // If no user or not a provider, show nothing (will be redirected)
  if (!user || user.role !== "provider") {
    return null
  }

  // User is a job provider, render children
  return <>{children}</>
}

