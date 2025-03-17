"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

function LoginForm() {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerRole, setRegisterRole] = useState<"candidate" | "provider">("candidate")
  const [companyName, setCompanyName] = useState("")
  const [companyIndustry, setCompanyIndustry] = useState("")
  const [companyLocation, setCompanyLocation] = useState("")
  const [loginError, setLoginError] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)

  const { login, register, isLoading, user } = useAuth()
  const router = useRouter()

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter both email and password")
      return
    }

    const success = await login(loginEmail, loginPassword)
    if (!success) {
      setLoginError("Invalid email or password")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")
    setIsRegistering(true)

    if (!registerEmail || !registerPassword || !registerName) {
      setRegisterError("Please fill all required fields")
      setIsRegistering(false)
      return
    }

    if (registerRole === "provider" && (!companyName || !companyIndustry || !companyLocation)) {
      setRegisterError("Please fill all company information")
      setIsRegistering(false)
      return
    }

    try {
      const success = await register(registerEmail, registerPassword, registerName, registerRole)
      if (!success) {
        setRegisterError("Registration failed. Please try again.")
      } else {
        // Registration successful - redirect to dashboard
        // The onboarding flow will be triggered automatically
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setRegisterError("An unexpected error occurred. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">AI Interview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Virtual AI-powered interview platform</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create a new account</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  {registerError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{registerError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="email@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <RadioGroup
                      value={registerRole}
                      onValueChange={(value) => setRegisterRole(value as "candidate" | "provider")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="candidate" id="candidate" />
                        <Label htmlFor="candidate">Job Seeker</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="provider" id="provider" />
                        <Label htmlFor="provider">Job Provider / Company</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {registerRole === "provider" && (
                    <div className="space-y-4 border-t pt-4 mt-4">
                      <h3 className="font-medium">Company Information</h3>
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input
                          id="company-name"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-industry">Industry</Label>
                        <Input
                          id="company-industry"
                          value={companyIndustry}
                          onChange={(e) => setCompanyIndustry(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-location">Location</Label>
                        <Input
                          id="company-location"
                          value={companyLocation}
                          onChange={(e) => setCompanyLocation(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading || isRegistering}>
                    {isRegistering ? "Creating Account..." : "Register"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}

