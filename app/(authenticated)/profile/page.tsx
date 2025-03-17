"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Save,
  Upload,
  FileText,
  AlertCircle,
  Download,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { ProfileCompletionScore } from "../components/profile/profile-completion-score"
import React from "react"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Personal info
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState("+1 (555) 123-4567")
  const [location, setLocation] = useState("San Francisco, CA")
  const [about, setAbout] = useState(
    "Experienced software developer with a passion for building user-friendly applications.",
  )

  // Professional info
  const [title, setTitle] = useState("Software Developer")
  const [experience, setExperience] = useState("5 years")
  const [skills, setSkills] = useState("JavaScript, React, Node.js, TypeScript, HTML, CSS")

  // Education
  const [education, setEducation] = useState(
    "Bachelor of Science in Computer Science\nUniversity of California, Berkeley\n2015-2019",
  )

  // Resume
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [hasResume, setHasResume] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Profile completion fields
  const profileFields = useMemo(
    () => [
      { name: "name", value: name, weight: 10 },
      { name: "email", value: email, weight: 10 },
      { name: "phone", value: phone, weight: 5 },
      { name: "location", value: location, weight: 5 },
      { name: "about", value: about, weight: 10 },
      { name: "title", value: title, weight: 10 },
      { name: "experience", value: experience, weight: 5 },
      { name: "skills", value: skills, weight: 15 },
      { name: "education", value: education, weight: 10 },
      { name: "resume", value: hasResume || resumeFile !== null, weight: 20 },
    ],
    [name, email, phone, location, about, title, experience, skills, education, hasResume, resumeFile],
  )

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0])
    }
  }

  const handleUploadResume = async () => {
    if (!resumeFile) return

    setIsUploading(true)

    try {
      // In a real app, this would be an API call to upload the file
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setHasResume(true)

      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully.",
      })
    } catch (error) {
      console.error("Error uploading resume:", error)
      toast({
        title: "Error",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">My Profile</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your profile information visible to employers</p>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-2">{title}</p>
              <p className="text-sm text-center mb-4">{location}</p>
              <Button variant="outline" className="w-full mb-2">
                <Upload className="mr-2 h-4 w-4" /> Upload Photo
              </Button>
              <div className="w-full mt-4 pt-4 border-t">
                <h3 className="font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.split(", ").map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <ProfileCompletionScore fields={profileFields} className="mt-6" />

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" /> Resume
              </CardTitle>
              <CardDescription>Upload and manage your resume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasResume ? (
                <div className="border rounded-md p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className="font-medium">{resumeFile?.name || "Your_Resume.pdf"}</p>
                      <p className="text-xs text-gray-500">Uploaded on {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                  <FileText className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Drag and drop your resume or click to browse</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="mt-2">
                    Browse Files
                  </Button>
                </div>
              )}

              {resumeFile && !hasResume && (
                <div className="border rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm truncate max-w-[150px]">{resumeFile.name}</span>
                  </div>
                  <Button size="sm" onClick={handleUploadResume} disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Upload your resume to get AI-powered analysis and improvement suggestions.
                </AlertDescription>
              </Alert>

              <Button asChild className="w-full">
                <Link href="/resume-analysis">
                  <FileText className="mr-2 h-4 w-4" /> Analyze Resume
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <form onSubmit={handleSaveProfile}>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="about">About Me</Label>
                      <Textarea
                        id="about"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        className="min-h-[120px]"
                        placeholder="Tell employers about yourself"
                      />
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
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="professional">
              <Card>
                <form onSubmit={handleSaveProfile}>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>Update your work experience and skills</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills (comma separated)</Label>
                      <Textarea
                        id="skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="min-h-[100px]"
                        placeholder="JavaScript, React, Node.js, etc."
                      />
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
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <form onSubmit={handleSaveProfile}>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                    <CardDescription>Update your educational background</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="education">Education History</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="education"
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          className="min-h-[200px] pl-10"
                          placeholder="Degree, Institution, Years"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">Enter each education entry on a new line</p>
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
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

