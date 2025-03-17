"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type UserRole = "candidate" | "provider"

type User = {
  id: string
  email: string
  name: string
  role: UserRole
  companyId?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

// Mock user data
const MOCK_USERS = {
  provider1: {
    id: "u1",
    email: "admin@techcorp.com",
    name: "Tech Corp HR",
    role: "provider" as UserRole,
    companyId: "c1",
  },
  provider2: {
    id: "u2",
    email: "admin@innovatech.com",
    name: "InnovaTech Recruiter",
    role: "provider" as UserRole,
    companyId: "c2",
  },
  candidate: {
    id: "u3",
    email: "candidate@example.com",
    name: "Jane Smith",
    role: "candidate" as UserRole,
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Initialize auth state
  useEffect(() => {
    // Only run this once on client side
    if (initialized) return

    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error initializing auth:", error)
      localStorage.removeItem("user")
    } finally {
      setIsLoading(false)
      setInitialized(true)
    }
  }, [initialized])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock login logic
      if (email === "admin@techcorp.com" && password === "password") {
        localStorage.setItem("user", JSON.stringify(MOCK_USERS.provider1))
        setUser(MOCK_USERS.provider1)
        return true
      } else if (email === "admin@innovatech.com" && password === "password") {
        localStorage.setItem("user", JSON.stringify(MOCK_USERS.provider2))
        setUser(MOCK_USERS.provider2)
        return true
      } else if (email === "candidate@example.com" && password === "password") {
        localStorage.setItem("user", JSON.stringify(MOCK_USERS.candidate))
        setUser(MOCK_USERS.candidate)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole = "candidate",
  ): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock registration
      const newUser = {
        id: `u${Date.now()}`,
        email,
        name,
        role,
      }

      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

