"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database, Server, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [apiKey, setApiKey] = useState("sk-•••••••••••••••••••••••••••••••")
  const [modelVersion, setModelVersion] = useState("gpt-4")
  const [maxTokens, setMaxTokens] = useState("2048")
  const [temperature, setTemperature] = useState("0.7")

  const handleSystemUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "System settings updated",
      description: "Your system settings have been updated successfully.",
    })

    setSaving(false)
  }

  const handleAIUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "AI settings updated",
      description: "Your AI configuration has been updated successfully.",
    })

    setSaving(false)
  }

  const regenerateApiKey = async () => {
    setSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setApiKey("sk-" + Math.random().toString(36).substring(2, 30))

    toast({
      title: "API key regenerated",
      description: "Your API key has been regenerated successfully.",
    })

    setSaving(false)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="ai">AI Configuration</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <form onSubmit={handleSystemUpdate}>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Server className="h-4 w-4" />
                    <div>
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Put the system in maintenance mode</p>
                    </div>
                  </div>
                  <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4" />
                    <div>
                      <Label htmlFor="debug-mode">Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable detailed logging for debugging</p>
                    </div>
                  </div>
                  <Switch id="debug-mode" checked={debugMode} onCheckedChange={setDebugMode} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save System Settings"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>Configure AI model settings</CardDescription>
            </CardHeader>
            <form onSubmit={handleAIUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="model-version">AI Model</Label>
                  <Select value={modelVersion} onValueChange={setModelVersion}>
                    <SelectTrigger id="model-version">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls randomness: 0 is deterministic, 1 is very random
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save AI Settings"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys for external integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">OpenAI API Key</Label>
                <div className="flex">
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="rounded-r-none"
                  />
                  <Button variant="secondary" className="rounded-l-none" onClick={regenerateApiKey} disabled={saving}>
                    Regenerate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Used for AI interview processing</p>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Keep your API keys secure. They provide full access to the associated services.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

