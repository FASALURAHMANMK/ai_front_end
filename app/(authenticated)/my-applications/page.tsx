"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Calendar, Building, Clock, CheckCircle, XCircle, Clock3 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import jobRolesData from "@/data/job-roles.json"
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
  location: string
  salary: string
}

interface Company {
  id: string
  name: string
  industry: string
  location: string
}

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
  responses: any[]
}

export default function MyApplicationsPage() {
  const { user } = useAuth()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [jobRoles, setJobRoles] = useState<Record<string, JobRole>>({})
  const [companies, setCompanies] = useState<Record<string, Company>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Filter interviews by current user
        const userInterviews = (interviewsData as Interview[]).filter((interview) => interview.userId === user?.id)

        // Create maps for easier lookup
        const roles = (jobRolesData as JobRole[]).reduce(
          (acc, role) => {
            acc[role.id] = role
            return acc
          },
          {} as Record<string, JobRole>,
        )

        const companyMap = (companiesData as Company[]).reduce(
          (acc, company) => {
            acc[company.id] = company
            return acc
          },
          {} as Record<string, Company>,
        )

        setInterviews(userInterviews)
        setJobRoles(roles)
        setCompanies(companyMap)
      } catch (error) {
        console.error("Error fetching applications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.id) {
      fetchData()
    }
  }, [user?.id])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "hired":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "under_review":
      default:
        return <Clock3 className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "hired":
        return "Hired"
      case "rejected":
        return "Not Selected"
      case "under_review":
      default:
        return "Under Review"
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your job applications and interview results</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/jobs">Browse More Jobs</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardContent>
              <CardFooter>
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No applications yet</CardTitle>
            <CardDescription>Start applying for jobs to see your applications here</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Browse available jobs and complete AI interviews to apply.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {interviews.map((interview) => {
            const jobRole = jobRoles[interview.jobRoleId]
            const company = companies[interview.companyId]
            return (
              <Card key={interview.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{jobRole?.title || "Unknown Position"}</CardTitle>
                    <Badge
                      className={
                        interview.applicationStatus === "hired"
                          ? "bg-green-500"
                          : interview.applicationStatus === "rejected"
                            ? "bg-red-500"
                            : "bg-blue-500"
                      }
                    >
                      {getStatusText(interview.applicationStatus)}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center">
                    <Building className="mr-1 h-4 w-4" />
                    {company?.name || "Unknown Company"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        Applied on {new Date(interview.startedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        {jobRole?.location || "Unknown Location"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Interview Score:</span>
                      <span
                        className={
                          interview.score >= 80
                            ? "text-green-500"
                            : interview.score >= 70
                              ? "text-amber-500"
                              : "text-red-500"
                        }
                      >
                        {interview.score}/100
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      {getStatusIcon(interview.applicationStatus)}
                      <span className="ml-2 text-sm">
                        {interview.applicationStatus === "hired"
                          ? "Congratulations! You've been selected for this position."
                          : interview.applicationStatus === "rejected"
                            ? "Thank you for your interest. The position has been filled."
                            : "Your application is being reviewed by the hiring team."}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/interview/results/${interview.jobRoleId}`}>
                      <BarChart className="mr-2 h-4 w-4" /> View Interview Results
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

