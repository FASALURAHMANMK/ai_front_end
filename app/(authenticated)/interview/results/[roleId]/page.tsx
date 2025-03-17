"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, BarChart, Award, Check, X, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import jobRolesData from "@/data/job-roles.json"
import questionsData from "@/data/questions.json"
import interviewsData from "@/data/interviews.json"
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

interface Response {
  questionId: string
  response: string
  score: number
  feedback: string
}

interface Interview {
  id: string
  userId: string
  jobRoleId: string
  companyId: string
  status: string
  startedAt: string
  completedAt: string
  score: number
  feedback: string
  responses: Response[]
}

export default function InterviewResultsPage() {
  const params = useParams()
  const router = useRouter()
  const roleId = params.roleId as string

  const [jobRole, setJobRole] = useState<JobRole | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [interview, setInterview] = useState<Interview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchInterviewData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const role = (jobRolesData as JobRole[]).find((r) => r.id === roleId) || null
        const roleQuestions = (questionsData as Question[]).filter((q) => q.jobRoleId === roleId && q.active)

        // In a real app, you'd fetch the actual interview results
        // For demo purposes, we're using the sample data
        const interviewResult = (interviewsData as Interview[]).find((i) => i.jobRoleId === roleId) || null

        // Get company info
        const companyData = role ? (companiesData as Company[]).find((c) => c.id === role.companyId) || null : null

        setJobRole(role)
        setCompany(companyData)
        setQuestions(roleQuestions)
        setInterview(interviewResult)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInterviewData()
  }, [roleId])

  const handleDownloadReport = () => {
    setIsDownloading(true)

    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false)
      // In a real app, this would generate and download a PDF report
    }, 1500)
  }

  // Calculate performance metrics
  const strengthsAndWeaknesses = () => {
    if (!interview) return { strengths: [], weaknesses: [] }

    const responses = interview.responses
    const strengths = responses
      .filter((r) => r.score >= 80)
      .map((r) => {
        const question = questions.find((q) => q.id === r.questionId)
        return question?.text || ""
      })

    const weaknesses = responses
      .filter((r) => r.score < 70)
      .map((r) => {
        const question = questions.find((q) => q.id === r.questionId)
        return question?.text || ""
      })

    return { strengths, weaknesses }
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

  if (!jobRole || !interview) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {!jobRole ? "Job role not found." : "Interview results not found."}
            Please try again later.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <a href="/my-applications">Return to My Applications</a>
        </Button>
      </div>
    )
  }

  const { strengths, weaknesses } = strengthsAndWeaknesses()
  const completionPercentage = Math.round((interview.responses.length / questions.length) * 100)

  return (
    <div className="container mx-auto p-6">
      <Button variant="outline" className="mb-6" onClick={() => router.push("/my-applications")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Applications
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{jobRole.title} Interview Results</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {company?.name || "Company"} • Completed on {new Date(interview.completedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadReport} disabled={isDownloading}>
            <Download className="mr-2 h-4 w-4" /> {isDownloading ? "Downloading..." : "Download Report"}
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" /> Share Results
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="card-hover-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">
                {interview.score}
                <span className="text-lg font-normal text-gray-500">/100</span>
              </div>
              <Badge
                className={
                  interview.score >= 80 ? "bg-green-500" : interview.score >= 70 ? "bg-amber-500" : "bg-red-500"
                }
              >
                {interview.score >= 80 ? "Excellent" : interview.score >= 70 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>
            <Progress
              value={interview.score}
              className="h-2 mt-4"
              indicatorClassName={
                interview.score >= 80 ? "bg-green-500" : interview.score >= 70 ? "bg-amber-500" : "bg-red-500"
              }
            />
          </CardContent>
        </Card>

        <Card className="card-hover-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Questions Answered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">
                {interview.responses.length}
                <span className="text-lg font-normal text-gray-500">/{questions.length}</span>
              </div>
              <div className="text-sm text-gray-500">{completionPercentage}% Complete</div>
            </div>
            <Progress value={completionPercentage} className="h-2 mt-4" />
          </CardContent>
        </Card>

        <Card className="card-hover-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Time Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(() => {
                const start = new Date(interview.startedAt).getTime()
                const end = new Date(interview.completedAt).getTime()
                const diffMinutes = Math.round((end - start) / (1000 * 60))
                return `${diffMinutes} min`
              })()}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Average{" "}
              {Math.round(
                (new Date(interview.completedAt).getTime() - new Date(interview.startedAt).getTime()) /
                  (1000 * 60 * interview.responses.length),
              )}{" "}
              min per question
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="card-hover-effect">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-green-500" /> Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            {strengths.length > 0 ? (
              <ul className="space-y-2">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No significant strengths identified.</p>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover-effect">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-amber-500" /> Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weaknesses.length > 0 ? (
              <ul className="space-y-2">
                {weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <X className="mr-2 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No significant weaknesses identified.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8 card-hover-effect">
        <CardHeader>
          <CardTitle>Overall Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{interview.feedback}</p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild variant="outline">
            <a href="/jobs">Attend Another Interview</a>
          </Button>
        </CardFooter>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Question Details</h2>
      {interview.responses.map((response, index) => {
        const question = questions.find((q) => q.id === response.questionId)
        return (
          <Card key={index} className="mb-4 card-hover-effect">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Question {index + 1}
                <Badge
                  className={
                    response.score >= 80 ? "bg-green-500" : response.score >= 70 ? "bg-amber-500" : "bg-red-500"
                  }
                >
                  Score: {response.score}/100
                </Badge>
              </CardTitle>
              <CardDescription>{question?.text}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Your Answer:</h4>
                <p className="text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {response.response}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Feedback:</h4>
                <p className="text-gray-700 dark:text-gray-300">{response.feedback}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

