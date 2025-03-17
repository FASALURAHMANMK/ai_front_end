"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, Settings, LogOut, Bell, User, Building } from "lucide-react"

interface HeaderProps {
  sidebarVisible: boolean
  toggleSidebar: () => void
}

export function Header({ sidebarVisible, toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [unreadNotifications, setUnreadNotifications] = useState(3) // Example count

  if (!user) return null

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  const navigateToSettings = () => {
    const path = user.role === "admin" ? "/admin/settings" : "/settings"
    router.push(path)
  }

  const navigateToNotifications = () => {
    router.push("/notifications")
  }

  const navigateToProfile = () => {
    router.push("/profile")
  }

  const navigateToCompanyProfile = () => {
    router.push("/provider/company")
  }

  const isProvider = user.role === "provider"

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-4"
          aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
        >
          {sidebarVisible ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <h1 className="text-xl font-bold">AI Interview</h1>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={navigateToNotifications} className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center bg-red-500 text-white">
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
              </Avatar>
              <span className="font-medium hidden sm:inline-block">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />

            {/* Conditional menu items based on user role */}
            {!isProvider && (
              <DropdownMenuItem onClick={navigateToProfile} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
            )}

            {isProvider && (
              <DropdownMenuItem onClick={navigateToCompanyProfile} className="cursor-pointer">
                <Building className="mr-2 h-4 w-4" />
                <span>Company Profile</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={navigateToSettings} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

