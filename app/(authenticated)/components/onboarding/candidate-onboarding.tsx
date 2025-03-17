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

interface CandidateOnboardingProps {
  isOpen: boolean
  onClose: () => void
}

export function CandidateOnboarding({ isOpen, onClose }: CandidateOnboardingProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Personal information
  const [title, setTitle] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [about, setAbout] = useState("")

  // Professional information
  const [experience, setExperience] = useState("")
  const [skills, setSkills] = useState("")
  const [jobPreferences, setJobPreferences] = useState("")

  // Resume
  const [hasResume, setHasResume] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  // Job preferences
  const [jobTypes, setJobTypes] = useState<string[]>([])
  const [workModes, setWorkModes] = useState<string[]>([])
  const [salaryExpectation, setSalaryExpectation] = useState("")

  const handleComplete = async () => {
    try {
      // In a real app, this would be an API call to save the onboarding data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile setup complete",
        description: "Your profile has been set up successfully.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error completing onboarding:", error)
      toast({
        title: "Error",
        description: "Failed to complete profile setup. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0])
      setHasResume(true)
    }
  }

  const toggleJobType = (value: string) => {
    setJobTypes((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const toggleWorkMode = (value: string) => {
    setWorkModes((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  return (
    <MultiStepDialog
      title="Complete Your Profile"
      description="Let's set up your profile to help you find the perfect job"
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleComplete}
      steps={["Personal Info", "Professional", "Resume", "Preferences"]}
    >
      {/* Step 1: Personal Information */}
      <div className="space-y-4 py-2">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Tell us about yourself so employers can get to know you better.
        </p>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              placeholder="e.g. Software Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="e.g. +1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. San Francisco, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About Me</Label>
            <Textarea
              id="about"
              placeholder="Tell us about yourself..."
              className="min-h-[100px]"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Step 2: Professional Information */}
      <div className="space-y-4 py-2">
        <h2 className="text-xl font-semibold">Professional Information</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Share your professional experience and skills to stand out to employers.
        </p>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0-1 years</SelectItem>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5-10">5-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Textarea
              id="skills"
              placeholder="e.g. JavaScript, React, Node.js"
              className="min-h-[100px]"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobPreferences">Job Preferences</Label>
            <Textarea
              id="jobPreferences"
              placeholder="What kind of roles are you looking for?"
              className="min-h-[100px]"
              value={jobPreferences}
              onChange={(e) => setJobPreferences(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Step 3: Resume Upload */}
      <div className="space-y-4 py-2">
        <h2 className="text-xl font-semibold">Upload Your Resume</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your resume to apply for jobs quickly and get AI-powered feedback.
        </p>

        <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
          {resumeFile ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="font-medium">{resumeFile.name}</p>
              <p className="text-sm text-gray-500 mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setResumeFile(null)
                  setHasResume(false)
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
              <p className="text-sm text-gray-500 mb-2">Drag and drop your resume or click to browse</p>
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <Button variant="outline" size="sm" onClick={() => document.getElementById("resume-upload")?.click()}>
                Browse Files
              </Button>
              <p className="text-xs text-gray-400 mt-4">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
            </>
          )}
        </div>
      </div>

      {/* Step 4: Job Preferences */}
      <div className="space-y-4 py-2">
        <h2 className="text-xl font-semibold">Job Preferences</h2>
        <p className="text-sm text-muted-foreground mb-4">Tell us what you're looking for in your next role.</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Job Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Full-time", "Part-time", "Contract", "Internship", "Temporary", "Freelance"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`job-type-${type}`}
                    checked={jobTypes.includes(type)}
                    onCheckedChange={() => toggleJobType(type)}
                  />
                  <Label htmlFor={`job-type-${type}`} className="text-sm font-normal">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Work Mode</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Remote", "Hybrid", "On-site"].map((mode) => (
                <div key={mode} className="flex items-center space-x-2">
                  <Checkbox
                    id={`work-mode-${mode}`}
                    checked={workModes.includes(mode)}
                    onCheckedChange={() => toggleWorkMode(mode)}
                  />
                  <Label htmlFor={`work-mode-${mode}`} className="text-sm font-normal">
                    {mode}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salary Expectation</Label>
            <Select value={salaryExpectation} onValueChange={setSalaryExpectation}>
              <SelectTrigger>
                <SelectValue placeholder="Select salary range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-50k">$0 - $50,000</SelectItem>
                <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                <SelectItem value="150k+">$150,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </MultiStepDialog>
  )
}

