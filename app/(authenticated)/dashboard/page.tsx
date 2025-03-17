"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, FileText, ClipboardList, Clock, Briefcase, Building, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
  description: string
  logo: string
  industry: string
  location: string
  website: string
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
}

export default function Dashboard() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [companyJobs, setCompanyJobs] = useState<JobRole[]>([])
  const [companyInterviews, setCompanyInterviews] = useState<Interview[]>([])
  const [candidateInterviews, setCandidateInterviews] = useState<Interview[]>([])
  const [featuredJobs, setFeaturedJobs] = useState<JobRole[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [userCompany, setUserCompany] = useState<Company | null>(null)

  useEffect(() => {
    setMounted(true)

    // In a real app, these would be API calls with proper filtering
    const allJobs = jobRolesData as JobRole[]
    const allInterviews = interviewsData as Interview[]
    const allCompanies = companiesData as Company[]

    setCompanies(allCompanies)

    if (user?.role === "provider" && user?.companyId) {
      // For job providers, filter jobs and interviews by their company
      setCompanyJobs(allJobs.filter((job) => job.companyId === user.companyId))
      setCompanyInterviews(allInterviews.filter((interview) => interview.companyId === user.companyId))
      setUserCompany(allCompanies.find((company) => company.id === user.companyId) || null)
    } else if (user?.role === "candidate") {
      // For candidates, show their interviews and featured jobs
      setCandidateInterviews(allInterviews.filter((interview) => interview.userId === user.id))
      setFeaturedJobs(allJobs.slice(0, 4))
    }
  }, [user])

  if (!mounted || !user) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const isProvider = user.role === "provider"

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {isProvider
            ? `Manage your job listings and review candidate interviews for ${userCompany?.name || "your company"}`
            : "Find job opportunities and complete interviews with AI"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {isProvider ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Job Listings
                </CardTitle>
                <CardDescription>Manage your company's job listings</CardDescription>
              </CardHeader>
              <CardContent>
                <p>You have {companyJobs.length} active job listings.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/provider/jobs">Manage Jobs</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Candidate Interviews
                </CardTitle>
                <CardDescription>Review candidate interview results</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{companyInterviews.length} candidates have completed interviews.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/provider/candidates">Review Candidates</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5" />
                  Question Pool
                </CardTitle>
                <CardDescription>Manage your interview questions</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Create and customize interview questions for your jobs.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/provider/questions">Manage Questions</Link>
                </Button>
              </CardFooter>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Browse Jobs
                </CardTitle>
                <CardDescription>Find job opportunities and apply</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Explore jobs from top companies in your field.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5" />
                  My Applications
                </CardTitle>
                <CardDescription>Track your job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <p>You have {candidateInterviews.length} completed interviews.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/my-applications">View Applications</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Resume Profile
                </CardTitle>
                <CardDescription>Manage your resume and profile</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Update your resume and profile to improve your chances.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/profile">Update Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>

      {isProvider ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Recent Candidate Activity</h2>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Interviews</CardTitle>
              <CardDescription>Latest candidate interviews for your job listings</CardDescription>
            </CardHeader>
            <CardContent>
              {companyInterviews.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No interviews completed yet</p>
              ) : (
                <div className="space-y-4">
                  {companyInterviews.slice(0, 3).map((interview) => {
                    const job = companyJobs.find((job) => job.id === interview.jobRoleId)
                    return (
                      <div
                        key={interview.id}
                        className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div>
                          <h3 className="font-medium">{job?.title || "Unknown Position"}</h3>
                          <p className="text-sm text-muted-foreground">
                            Completed on {new Date(interview.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            className={
                              interview.score >= 80
                                ? "bg-green-500"
                                : interview.score >= 70
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }
                          >
                            {interview.score}/100
                          </Badge>
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
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/provider/candidates">View All Candidates</Link>
              </Button>
            </CardFooter>
          </Card>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Featured Job Opportunities</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {featuredJobs.map((job) => {
              const company = companies.find((c) => c.id === job.companyId)
              return (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="flex items-center">
                          <Building className="mr-1 h-4 w-4" />
                          {company?.name || "Unknown Company"}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{job.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm line-clamp-2 mb-2">{job.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {job.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {job.location}
                      </div>
                      <div>
                        <span className="font-medium">{job.salary}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/jobs/${job.id}`}>Apply Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          <h2 className="text-2xl font-bold mb-4">Top Companies Hiring</h2>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {companies.map((company) => (
              <Card key={company.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                    {company.logo ? (
                      <img src={company.logo || "/placeholder.svg"} alt={company.name} className="w-12 h-12" />
                    ) : (
                      <Building className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  <CardDescription>{company.industry}</CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-2">
                  <p className="text-sm text-muted-foreground">{company.location}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/companies/${company.id}`}>View Jobs</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

