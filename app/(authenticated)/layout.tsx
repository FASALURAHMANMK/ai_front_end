"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Header } from "./components/header"
import { Sidebar } from "./components/sidebar"
import { Footer } from "./components/footer"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { OnboardingManager } from "./components/onboarding/onboarding-manager"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AuthenticatedLayoutContent>{children}</AuthenticatedLayoutContent>
    </AuthProvider>
  )
}

function AuthenticatedLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  // Set mounted state after component mounts to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)

    // Check for mobile view and hide sidebar by default
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarVisible(false)
      } else {
        setSidebarVisible(true)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Reset sidebar visibility when pathname changes (for mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarVisible(false)
    }
  }, [pathname])

  // Don't render anything until mounted to avoid hydration mismatch
  if (!isMounted) {
    return null
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-gray-500 mb-4">Please log in to access this page</p>
          <a href="/login" className="text-blue-500 hover:underline">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Header sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        {sidebarVisible && <Sidebar />}
        <main className={`flex-1 transition-all duration-300 ${sidebarVisible ? "md:ml-64" : "ml-0"}`}>
          <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </main>
      </div>
      <OnboardingManager />
      <Toaster />
    </div>
  )
}

