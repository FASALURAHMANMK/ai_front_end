"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { BarChart, ClipboardList, Home, Users, Briefcase, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !user) {
    return null
  }

  const isProvider = user.role === "provider"

  const providerItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/provider/jobs", label: "Job Listings", icon: Briefcase },
    { href: "/provider/candidates", label: "Candidates", icon: Users },
    { href: "/provider/questions", label: "Question Pool", icon: ClipboardList },
  ]

  const candidateItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/jobs", label: "Browse Jobs", icon: Briefcase },
    { href: "/my-applications", label: "My Applications", icon: BarChart },
    { href: "/resume-analysis", label: "Resume Analysis", icon: FileText },
  ]

  const menuItems = isProvider ? providerItems : candidateItems

  return (
    <div className="fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-16 md:translate-x-0">
      <div className="p-4 h-full overflow-y-auto">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
                  "justify-start",
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

