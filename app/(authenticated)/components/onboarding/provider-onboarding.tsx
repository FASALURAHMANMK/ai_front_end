"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MultiStepDialog } from "@/components/ui/multi-step-dialog"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface ProviderOnboardingProps {
  isOpen: boolean
  onClose: () => void
}

export function ProviderOnboarding({ isOpen, onClose }: ProviderOnboardingProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Company information
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [companyWebsite, setCompanyWebsite] = useState("")
  const [companyDescription, setCompanyDescription] = useState("")

  // Recruitment needs
  const [hiringRoles, setHiringRoles] = useState("")
  const [hiringTimeline, setHiringTimeline] = useState("")
  const [hiringVolume, setHiringVolume] = useState("")

  // Company culture
  const [coreValues, setCoreValues] = useState("")
  const [benefits, setBenefits] = useState("")
  const [workEnvironment, setWorkEnvironment] = useState<string[]>([])

  // Branding
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [hasLogo, setHasLogo] = useState(false)
  const [brandColors, setBrandColors] = useState("#000000")

  const handleComplete = async () => {
    try {
      // In a real app, this would be an API call to save the onboarding data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Company profile setup complete",
        description: "Your company profile has been set up successfully.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error completing onboarding:", error)
      toast({
        title: "Error",
        description: "Failed to complete company profile setup. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0])
      setHasLogo(true)
    }
  }

  const toggleWorkEnvironment = (value: string) => {
    setWorkEnvironment((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  return (
    <MultiStepDialog
      title="Complete Your Company Profile"
      description="Let's set up your company profile to attract the best candidates"
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleComplete}
      steps={["Company Info", "Recruitment", "Culture", "Branding"]}
    >
      {/* Step 1: Company Information */}
      <div className="space-y-4 py-2">
        <h2 className="text-xl font-semibold">Company Information</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Tell us about your company so candidates can learn more about you.
        </p>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="e.g. Acme Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companySize">Company Size</Label>
            <Select value={companySize} onValueChange={setCompanySize}>
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-500">201-500 employees</SelectItem>
                <SelectItem value="501-1000">501-1000 employees</SelectItem>
                <SelectItem value="1000+">1000+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyWebsite">Company Website</Label>
            <Input
              id="companyWebsite"
              placeholder="e.g. https://www.acme.com"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyDescription">Company Description</Label>
            <Textarea
              id="companyDescription"
              placeholder="Tell us about your company..."
              className="min-h-[100px]"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Step 2: Recruitment Needs */}
      <div className="space-y-4 py-2">
        <h2 className="text-xl font-semibold">Recruitment Needs</h2>
        <p className="text-sm text-muted-foreground mb-4">Share your current hiring needs and goals.</p>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="hiringRoles">What roles are you hiring for?</Label>
            <Textarea
              id="hiringRoles"
              placeholder="e.g. Software Engineers, Product Managers, etc."
              className="min-h-[100px]"
              value={hiringRoles}
              onChange={(e) => setHiringRoles(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hiringTimeline">Hiring Timeline</Label>
            <Select value={hiringTimeline} onValueChange={setHiringTimeline}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate (ASAP)</SelectItem>
                <SelectItem value="1-month">Within 1 month</SelectItem>
                <SelectItem value="3-months">Within 3 months</SelectItem>
                <SelectItem value="6-months">Within 6 months</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hiringVolume">Hiring Volume</Label>
            <Select value={hiringVolume} onValueChange={setHiringVolume}>
              <SelectTrigger>
                <SelectValue placeholder="Select volume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5">1-5 positions</SelectItem>
                <SelectItem value="6-10">6-10 positions</SelectItem>
                <SelectItem value="11-25">11-25 positions</SelectItem>
                <SelectItem value="26-50">26-50 positions</SelectItem>
                <SelectItem value="50+">50+ positions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Step 3: Company Culture */}
      <div className="space-y-4 py-2">
        <h2 className="text-xl font-semibold">Company Culture</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Share your company culture to attract candidates who align with your values.
        </p>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="coreValues">Core Values</Label>
            <Textarea
              id="coreValues"
              placeholder="What are your company's core values?"
              className="min-h-[100px]"
              value={coreValues}
              onChange={(e) => setCoreValues(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits & Perks</Label>
            <Textarea
              id="benefits"
              placeholder="What benefits do you offer to employees?"
              className="min-h-[100px]"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Work Environment</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Remote-friendly",
                "Flexible hours",
                "Casual dress",
                "Dog-friendly",
                "Open office",
                "Collaborative",
              ].map((env) => (
                <div key={env} className="flex items-center space-x-2">
                  <Checkbox
                    id={`env-${env}`}
                    checked={workEnvironment.includes(env)}
                    onCheckedChange={() => toggleWorkEnvironment(env)}
                  />
                  <Label htmlFor={`env-${env}`} className="text-sm font-normal">
                    {env}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Company Branding */}
      <div className="space-y-4 py-2">
        <h2 className="text-xl font-semibold">Company Branding</h2>
        <p className="text-sm text-muted-foreground mb-4">Upload your company logo and set your brand colors.</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
              {logoFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                    <img
                      src={URL.createObjectURL(logoFile) || "/placeholder.svg"}
                      alt="Company logo preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <p className="font-medium">{logoFile.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{(logoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setLogoFile(null)
                      setHasLogo(false)
                    }}
                  >
                    Replace
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Drag and drop your logo or click to browse</p>
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.svg"
                    onChange={handleFileChange}
                  />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById("logo-upload")?.click()}>
                    Browse Files
                  </Button>
                  <p className="text-xs text-gray-400 mt-4">Supported formats: JPG, PNG, SVG (Max 2MB)</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandColors">Brand Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="brandColors"
                value={brandColors}
                onChange={(e) => setBrandColors(e.target.value)}
                className="w-10 h-10 rounded border p-1"
              />
              <Input value={brandColors} onChange={(e) => setBrandColors(e.target.value)} className="w-32" />
            </div>
          </div>
        </div>
      </div>
    </MultiStepDialog>
  )
}

