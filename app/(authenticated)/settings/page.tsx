"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Bell, Shield, Moon, Sun } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [saving, setSaving] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [browserNotifications, setBrowserNotifications] = useState(true)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })

    setSaving(false)
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }

    setSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    })

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setSaving(false)
  }

  const handleNotificationUpdate = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    })
  }

  const handleSecurityUpdate = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    toast({
      title: "Security settings updated",
      description: "Your security preferences have been saved.",
    })
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real app, you would update the theme here
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile information</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={toggleDarkMode} />
                  <Label htmlFor="dark-mode" className="cursor-pointer flex items-center">
                    {darkMode ? (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Dark Mode
                      </>
                    ) : (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        Light Mode
                      </>
                    )}
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordUpdate}>
              <CardContent className="space-y-4">
                {passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={(checked) => {
                    setEmailNotifications(checked)
                    handleNotificationUpdate()
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <Label htmlFor="browser-notifications">Browser Notifications</Label>
                </div>
                <Switch
                  id="browser-notifications"
                  checked={browserNotifications}
                  onCheckedChange={(checked) => {
                    setBrowserNotifications(checked)
                    handleNotificationUpdate()
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <div>
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <Switch
                  id="two-factor"
                  checked={twoFactorAuth}
                  onCheckedChange={(checked) => {
                    setTwoFactorAuth(checked)
                    handleSecurityUpdate()
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

