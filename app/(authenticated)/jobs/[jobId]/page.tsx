"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building, MapPin, DollarSign, Clock, Calendar, CheckCircle } from "lucide-react"
import jobRolesData from "@/data/job-roles.json"
import companiesData from "@/data/companies.json"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface JobRole {
  id: string
  companyId: string
  title: string
  description: string
  skills: string[]
  level: string
  active: boolean
  location: string
  salary: string
}

interface Company {
  id: string
  name: string
  description: string
  logo: string
  industry: string
  location: string
  website: string
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const jobId = params.jobId as string

  const [job, setJob] = useState<JobRole | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [similarJobs, setSimilarJobs] = useState<JobRole[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Find the job
        const jobData = (jobRolesData as JobRole[]).find((j) => j.id === jobId)
        if (!jobData) {
          router.push("/jobs")
          return
        }

        setJob(jobData)

        // Find the company
        const companyData = (companiesData as Company[]).find((c) => c.id === jobData.companyId)
        setCompany(companyData || null)

        // Find similar jobs (same company or similar skills)
        const similar = (jobRolesData as JobRole[])
          .filter(
            (j) =>
              j.id !== jobId &&
              j.active &&
              (j.companyId === jobData.companyId || j.skills.some((skill) => jobData.skills.includes(skill))),
          )
          .slice(0, 3)

        setSimilarJobs(similar)
      } catch (error) {
        console.error("Error fetching job data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [jobId, router])

  const handleApply = async () => {
    setIsApplying(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully. Prepare for your interview!",
      })

      // Navigate to interview preparation
      router.push(`/interview/prepare/${jobId}`)
    } catch (error) {
      console.error("Error applying for job:", error)
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsApplying(false)
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

  if (!job || !company) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="outline" className="mb-6" onClick={() => router.push("/jobs")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-lg font-medium">Job not found</p>
            <p className="text-gray-500 dark:text-gray-400">
              The job you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="outline" className="mb-6" onClick={() => router.push("/jobs")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Building className="mr-1 h-4 w-4" />
                    <Link href={`/companies/${company.id}`} className="hover:underline">
                      {company.name}
                    </Link>
                  </CardDescription>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                  <Badge variant="outline" className="text-sm">
                    {job.level}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>Posted 2 weeks ago</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>Full-time</span>
                </div>
              </div>

              <Tabs defaultValue="description" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Job Description</h3>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      <li>Design, develop, and maintain high-quality software applications</li>
                      <li>Collaborate with cross-functional teams to define and implement new features</li>
                      <li>Write clean, maintainable, and efficient code</li>
                      <li>Troubleshoot and debug applications</li>
                      <li>Participate in code reviews and contribute to team knowledge sharing</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Benefits</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      <li>Competitive salary and equity package</li>
                      <li>Health, dental, and vision insurance</li>
                      <li>Flexible work arrangements</li>
                      <li>Professional development budget</li>
                      <li>Generous paid time off</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="requirements" className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Qualifications</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      <li>
                        {job.level === "Entry-Level"
                          ? "Bachelor's degree in Computer Science or related field"
                          : "Bachelor's or Master's degree in Computer Science or related field"}
                      </li>
                      <li>
                        {job.level === "Entry-Level"
                          ? "0-2 years of experience"
                          : job.level === "Mid-Level"
                            ? "3-5 years of experience"
                            : "5+ years of experience"}
                      </li>
                      <li>Strong problem-solving abilities</li>
                      <li>Excellent communication and teamwork skills</li>
                      <li>Ability to learn quickly and adapt to new technologies</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="company" className="mt-4 space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      {company.logo ? (
                        <img
                          src={company.logo || "/placeholder.svg"}
                          alt={company.name}
                          className="w-16 h-16 object-contain"
                        />
                      ) : (
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="text-xl">{company.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {company.industry} · {company.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300">{company.description}</p>

                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/companies/${company.id}`}>View Company Profile</Link>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={handleApply} disabled={isApplying} className="w-full">
                {isApplying ? (
                  "Processing..."
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" /> Apply Now
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Job Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Experience Level</span>
                <span className="text-sm">{job.level}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Location</span>
                <span className="text-sm">{job.location}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Salary Range</span>
                <span className="text-sm">{job.salary}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Employment Type</span>
                <span className="text-sm">Full-time</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Application Process</span>
                <span className="text-sm">AI Interview</span>
              </div>
            </CardContent>
          </Card>

          {similarJobs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {similarJobs.map((similarJob) => {
                  const similarCompany = companiesData.find((c) => c.id === similarJob.companyId)
                  return (
                    <div key={similarJob.id} className="pb-3 border-b last:border-0 last:pb-0">
                      <Link
                        href={`/jobs/${similarJob.id}`}
                        className="block hover:bg-gray-50 dark:hover:bg-gray-800 -mx-3 p-3 rounded-md transition-colors"
                      >
                        <h4 className="font-medium">{similarJob.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Building className="mr-1 h-3 w-3" />
                          <span>{similarCompany?.name}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            <span>{similarJob.location}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {similarJob.level}
                          </Badge>
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/jobs">View All Jobs</Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

