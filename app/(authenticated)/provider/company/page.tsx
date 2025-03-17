"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Building, Globe, MapPin, Briefcase, Save } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import companiesData from "@/data/companies.json"

interface Company {
  id: string
  name: string
  description: string
  logo: string
  industry: string
  location: string
  website: string
}

export default function CompanyProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [industry, setIndustry] = useState("")
  const [location, setLocation] = useState("")
  const [website, setWebsite] = useState("")

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (user?.companyId) {
          const companyData = (companiesData as Company[]).find((c) => c.id === user.companyId)
          setCompany(companyData || null)

          if (companyData) {
            setName(companyData.name)
            setDescription(companyData.description)
            setIndustry(companyData.industry)
            setLocation(companyData.location)
            setWebsite(companyData.website)
          }
        }
      } catch (error) {
        console.error("Error fetching company:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompany()
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      if (company) {
        const updatedCompany = {
          ...company,
          name,
          description,
          industry,
          location,
          website,
        }
        setCompany(updatedCompany)
      }

      toast({
        title: "Company profile updated",
        description: "Your company profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating company:", error)
      toast({
        title: "Error",
        description: "Failed to update company profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Company Profile</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your company information visible to candidates</p>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleSave}>
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company details to attract the right candidates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="company-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-description">Description</Label>
                  <Textarea
                    id="company-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px]"
                    placeholder="Describe your company, mission, and culture"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-industry">Industry</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="company-industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="company-location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="company-website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="pl-10"
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Company Logo</CardTitle>
              <CardDescription>Upload your company logo</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                {company?.logo ? (
                  <img
                    src={company.logo || "/placeholder.svg"}
                    alt={`${company.name} logo`}
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  <Building className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <Button variant="outline" className="w-full">
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Recommended: 400x400px, PNG or JPG</p>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How candidates see your company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                    {company?.logo ? (
                      <img
                        src={company.logo || "/placeholder.svg"}
                        alt={`${company.name} logo`}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <Building className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{name || "Company Name"}</h3>
                    <p className="text-xs text-muted-foreground">{industry || "Industry"}</p>
                  </div>
                </div>
                <p className="text-sm line-clamp-3 mb-2">{description || "Company description will appear here"}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{location || "Location"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

