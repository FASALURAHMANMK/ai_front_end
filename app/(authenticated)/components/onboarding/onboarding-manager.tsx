"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { CandidateOnboarding } from "./candidate-onboarding"
import { ProviderOnboarding } from "./provider-onboarding"

export function OnboardingManager() {
  const { user } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)

  useEffect(() => {
    // Check if user needs onboarding
    // In a real app, this would check a user property like "onboardingCompleted"
    if (user && !onboardingCompleted) {
      // Simulate a delay to avoid immediate popup after login/registration
      const timer = setTimeout(() => {
        setShowOnboarding(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [user, onboardingCompleted])

  const handleCloseOnboarding = () => {
    setShowOnboarding(false)
    setOnboardingCompleted(true)

    // In a real app, you would update the user's onboarding status in the database
  }

  if (!user) return null

  return (
    <>
      {user.role === "candidate" && <CandidateOnboarding isOpen={showOnboarding} onClose={handleCloseOnboarding} />}

      {user.role === "provider" && <ProviderOnboarding isOpen={showOnboarding} onClose={handleCloseOnboarding} />}
    </>
  )
}

