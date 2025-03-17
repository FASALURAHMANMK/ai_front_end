"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowLeft, CheckCircle, Clock, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import jobRolesData from "@/data/job-roles.json"
import questionsData from "@/data/questions.json"
import companiesData from "@/data/companies.json"

interface JobRole {
  id: string
  companyId: string
  title: string
  description: string
  skills: string[]
  level: string
  active: boolean
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

interface Question {
  id: string
  jobRoleId: string
  text: string
  difficulty: string
  timeLimit: number
  responseType: string
  active: boolean
}

export default function InterviewPreparePage() {
  const params = useParams()
  const router = useRouter()
  const roleId = params.roleId as string

  const [jobRole, setJobRole] = useState<JobRole | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const role = (jobRolesData as JobRole[]).find((r) => r.id === roleId) || null
        if (!role) {
          return
        }

        setJobRole(role)

        // Get company info
        const companyData = (companiesData as Company[]).find((c) => c.id === role.companyId) || null
        setCompany(companyData)

        // Get questions for this role
        const roleQuestions = (questionsData as Question[]).filter((q) => q.jobRoleId === roleId && q.active)
        setQuestions(roleQuestions)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [roleId])

  const startInterview = async () => {
    setIsStarting(true)

    try {
      // In a real app, this would be an API call to initialize the interview
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to the interview session
      router.push(`/interview/session/${roleId}`)
    } catch (error) {
      console.error("Error starting interview:", error)
      setIsStarting(false)
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

  if (!jobRole || questions.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="outline" className="mb-6" onClick={() => router.push("/jobs")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {!jobRole ? "Job role not found." : "No questions available for this job role."}
            Please try another role.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Calculate estimated interview time
  const totalTimeInMinutes = questions.reduce((acc, q) => acc + Math.ceil(q.timeLimit / 60), 0)

  return (
    <div className="container mx-auto p-6">
      <Button variant="outline" className="mb-6" onClick={() => router.push(`/jobs/${roleId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Job Details
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{jobRole.title} Interview</CardTitle>
                  <CardDescription className="mt-1">
                    {company?.name || "Company"} • {jobRole.level} • {jobRole.location}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="w-fit">
                  <Clock className="mr-1 h-4 w-4" /> {totalTimeInMinutes} min
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Interview Overview</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  This AI-powered interview will assess your skills and qualifications for the {jobRole.title} position
                  at {company?.name || "the company"}. The interview consists of {questions.length} questions covering
                  various aspects of the role.
                </p>

                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Important Information</AlertTitle>
                  <AlertDescription>
                    Your responses will be evaluated by our AI system. You'll receive feedback and results after
                    completing all questions.
                  </AlertDescription>
                </Alert>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {jobRole.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Interview Format</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{questions.length} questions covering technical skills and experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Multiple response formats: text, audio, or video</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Each question has a time limit - manage your time wisely</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Comprehensive feedback provided at the end of the interview</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startInterview} disabled={isStarting} className="w-full">
                {isStarting ? "Preparing Interview..." : "Start Interview Now"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Interview Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Questions</span>
                <span className="text-sm">{questions.length}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Estimated Time</span>
                <span className="text-sm">{totalTimeInMinutes} minutes</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Difficulty</span>
                <span className="text-sm">
                  {(() => {
                    const easyCount = questions.filter((q) => q.difficulty === "easy").length
                    const mediumCount = questions.filter((q) => q.difficulty === "medium").length
                    const hardCount = questions.filter((q) => q.difficulty === "hard").length

                    if (hardCount > mediumCount && hardCount > easyCount) return "Hard"
                    if (mediumCount > easyCount) return "Medium"
                    return "Easy"
                  })()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Response Types</span>
                <span className="text-sm">Text, Audio, Video</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Success</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Find a quiet place without distractions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Test your microphone and camera before starting</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Read each question carefully before answering</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Provide specific examples from your experience</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Be concise but thorough in your responses</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Watch the timer and pace yourself accordingly</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

