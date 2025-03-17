"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Clock, Info, AlertTriangle, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: "info" | "warning" | "success"
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock notifications data
      const mockNotifications: Notification[] = [
        {
          id: "n1",
          title: "Interview Completed",
          message: "Your Frontend Developer interview has been analyzed. View your results now!",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          read: false,
          type: "success",
        },
        {
          id: "n2",
          title: "New Job Role Available",
          message: "A new DevOps Engineer role is now available for interview practice.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          read: false,
          type: "info",
        },
        {
          id: "n3",
          title: "Resume Analysis Complete",
          message: "Your resume has been analyzed. Check out the suggestions to improve it!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          read: false,
          type: "success",
        },
        {
          id: "n4",
          title: "Interview Scheduled",
          message: "You have scheduled a Backend Developer interview for tomorrow.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          read: true,
          type: "info",
        },
        {
          id: "n5",
          title: "Account Security",
          message: "We noticed a login from a new device. Please verify if this was you.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          read: true,
          type: "warning",
        },
      ]

      setNotifications(mockNotifications)
      setIsLoading(false)
    }

    fetchNotifications()
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "success":
        return <Check className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Stay updated with your interview progress and system updates
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" className="mt-4 md:mt-0" onClick={markAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all" className="relative">
            All
            {notifications.length > 0 && <Badge className="ml-2 bg-gray-500">{notifications.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="unread" className="relative">
            Unread
            {unreadCount > 0 && <Badge className="ml-2 bg-red-500">{unreadCount}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-gray-500 dark:text-gray-400">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={cn("transition-colors", !notification.read && "border-l-4 border-l-blue-500")}
                >
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <div className="flex items-center">
                      {getNotificationIcon(notification.type)}
                      <CardTitle className="text-lg ml-2">{notification.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatTimestamp(notification.timestamp)}
                      </Badge>
                      {!notification.read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{notification.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : unreadCount === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCheck className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No unread notifications</p>
                <p className="text-gray-500 dark:text-gray-400">You've read all your notifications</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications
                .filter((notification) => !notification.read)
                .map((notification) => (
                  <Card key={notification.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2 flex flex-row items-start justify-between">
                      <div className="flex items-center">
                        {getNotificationIcon(notification.type)}
                        <CardTitle className="text-lg ml-2">{notification.title}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatTimestamp(notification.timestamp)}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{notification.message}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

