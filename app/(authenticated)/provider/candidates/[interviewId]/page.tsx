"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle, XCircle, Clock, Award, BarChart, Building, Mail, Phone } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import interviewsData from "@/data/interviews.json"
import jobRolesData from "@/data/job-roles.json"
import questionsData from "@/data/updated-questions.json"
import usersData from "@/data/users.json"

interface Interview {
  id: string
  userId: string
  jobRoleId: string
  companyId: string
  status: string
  applicationStatus: string
  startedAt: string
  completedAt: string
  score: number
  feedback: string
  responses: {
    questionId: string
    response: string
    score: number
    feedback: string
  }[]
}

interface JobRole {
  id: string
  title: string
  description: string
  skills: string[]
  level: string
}

interface Question {
  id: string
  poolId: string
  text: string
  difficulty: string
  timeLimit: number
  responseTypes: string[]
  options: string[]
}

interface Candidate {
  id: string
  name: string
  email: string
}

export default function CandidateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const interviewId = params.interviewId as string

  const [interview, setInterview] = useState<Interview | null>(null)
  const [jobRole, setJobRole] = useState<JobRole | null>(null)
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [questions, setQuestions] = useState<Record<string, Question>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Find the interview
        const interviewData = (interviewsData as Interview[]).find((i) => i.id === interviewId)

        if (!interviewData || interviewData.companyId !== user?.companyId) {
          router.push("/provider/candidates")
          return
        }

        // Get related data
        const roleData = (jobRolesData as JobRole[]).find((r) => r.id === interviewData.jobRoleId)
        const candidateData = (usersData as Candidate[]).find((c) => c.id === interviewData.userId)

        // Create a map of question IDs to questions
        const questionMap = (questionsData as Question[]).reduce(
          (acc, question) => {
            acc[question.id] = question
            return acc
          },
          {} as Record<string, Question>,
        )

        setInterview(interviewData)
        setJobRole(roleData || null)
        setCandidate(candidateData || null)
        setQuestions(questionMap)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (interviewId && user?.companyId) {
      fetchData()
    }
  }, [interviewId, user, router])

  const handleUpdateStatus = (newStatus: string) => {
    // In a real app, this would be an API call
    if (interview) {
      setInterview({
        ...interview,
        applicationStatus: newStatus,
      })
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

  if (!interview || !jobRole || !candidate) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="outline" className="mb-6" onClick={() => router.push("/provider/candidates")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Candidates
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-lg font-medium">Interview not found</p>
            <p className="text-gray-500 dark:text-gray-400">
              The requested interview does not exist or you don't have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="outline" className="mb-6" onClick={() => router.push("/provider/candidates")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Candidates
      </Button>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{candidate.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Building className="mr-1 h-4 w-4" />
                    {jobRole.title} ({jobRole.level})
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={
                    interview.applicationStatus === "hired"
                      ? "border-green-500 text-green-500"
                      : interview.applicationStatus === "rejected"
                        ? "border-red-500 text-red-500"
                        : "border-blue-500 text-blue-500"
                  }
                >
                  {interview.applicationStatus === "hired"
                    ? "Hired"
                    : interview.applicationStatus === "rejected"
                      ? "Rejected"
                      : "Under Review"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Applied on {new Date(interview.startedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Skills Match</h3>
                <div className="flex flex-wrap gap-2">
                  {jobRole.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleUpdateStatus("rejected")}
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject Candidate
              </Button>
              <Button className="bg-green-500 hover:bg-green-600" onClick={() => handleUpdateStatus("hired")}>
                <CheckCircle className="mr-2 h-4 w-4" /> Hire Candidate
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Interview Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{interview.score}</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={interview.score >= 80 ? "#10b981" : interview.score >= 70 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="3"
                    strokeDasharray={`${interview.score}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <Badge
                className={
                  interview.score >= 80 ? "bg-green-500" : interview.score >= 70 ? "bg-amber-500" : "bg-red-500"
                }
              >
                {interview.score >= 80 ? "Excellent" : interview.score >= 70 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Interview Summary</h3>
              <p className="text-sm">{interview.feedback}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="responses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="responses">Interview Responses</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="responses">
          <div className="space-y-6">
            {interview.responses.map((response, index) => {
              const question = questions[response.questionId]
              return (
                <Card key={response.questionId || index}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <Badge
                        className={
                          response.score >= 80 ? "bg-green-500" : response.score >= 70 ? "bg-amber-500" : "bg-red-500"
                        }
                      >
                        Score: {response.score}/100
                      </Badge>
                    </div>
                    <CardDescription>{question?.text || "Unknown Question"}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Candidate's Answer:</h4>
                      <p className="text-gray-700 dark:text-gray-300">{response.response}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">AI Feedback:</h4>
                      <p className="text-gray-700 dark:text-gray-300">{response.feedback}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
              <CardDescription>Automated analysis of candidate's interview performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="flex items-center font-medium mb-3">
                    <Award className="mr-2 h-5 w-5 text-green-500" /> Strengths
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Strong technical knowledge in core areas</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Clear communication and explanation skills</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Demonstrates problem-solving approach</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="flex items-center font-medium mb-3">
                    <BarChart className="mr-2 h-5 w-5 text-amber-500" /> Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <XCircle className="mr-2 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Could provide more specific examples</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="mr-2 h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Limited depth in some technical areas</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Overall Assessment</h3>
                <p>
                  This candidate demonstrates solid technical knowledge and communication skills that align well with
                  the requirements for the {jobRole.title} position. Their responses show a methodical approach to
                  problem-solving and good understanding of core concepts.
                </p>
                <p className="mt-2">
                  While there are some areas where deeper expertise would be beneficial, the candidate shows potential
                  and could be a good fit for the team with some additional training in specific areas.
                </p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Recommendation</h3>
                <p
                  className={
                    interview.score >= 80
                      ? "text-green-600 dark:text-green-400 font-medium"
                      : interview.score >= 70
                        ? "text-amber-600 dark:text-amber-400 font-medium"
                        : "text-red-600 dark:text-red-400 font-medium"
                  }
                >
                  {interview.score >= 80
                    ? "Strongly recommend hiring this candidate"
                    : interview.score >= 70
                      ? "Consider hiring with additional technical assessment"
                      : "Recommend additional screening before making a decision"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

