"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, MapPin, DollarSign, Globe, Users } from "lucide-react"
import jobRolesData from "@/data/job-roles.json"
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

export default function CompanyProfilePage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.companyId as string

  const [company, setCompany] = useState<Company | null>(null)
  const [companyJobs, setCompanyJobs] = useState<JobRole[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Find the company
        const companyData = (companiesData as Company[]).find((c) => c.id === companyId)
        if (!companyData) {
          router.push("/jobs")
          return
        }

        setCompany(companyData)

        // Find all jobs from this company
        const jobs = (jobRolesData as JobRole[]).filter((job) => job.companyId === companyId && job.active)

        setCompanyJobs(jobs)
      } catch (error) {
        console.error("Error fetching company data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [companyId, router])

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

  if (!company) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="outline" className="mb-6" onClick={() => router.push("/jobs")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-lg font-medium">Company not found</p>
            <p className="text-gray-500 dark:text-gray-400">
              The company you're looking for doesn't exist or has been removed.
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

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div>
                {company.logo ? (
                  <img
                    src={company.logo || "/placeholder.svg"}
                    alt={`${company.name} logo`}
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl">{company.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">{company.name}</CardTitle>
                <CardDescription>{company.industry}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 text-sm">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{company.location}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{company.website}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>50-200 employees</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">About {company.name}</h3>
                <p className="text-gray-700 dark:text-gray-300">{company.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Company Culture</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  At {company.name}, we believe in fostering a collaborative and innovative environment where employees
                  can thrive. We value diversity, continuous learning, and work-life balance. Our team is passionate
                  about creating solutions that make a difference in the world.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Benefits</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Competitive salary and equity packages</li>
                  <li>Comprehensive health, dental, and vision insurance</li>
                  <li>Flexible work arrangements and remote options</li>
                  <li>Professional development budget</li>
                  <li>Generous paid time off and parental leave</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Founded</span>
                <span className="text-sm">2015</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Industry</span>
                <span className="text-sm">{company.industry}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Company Size</span>
                <span className="text-sm">50-200 employees</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Headquarters</span>
                <span className="text-sm">{company.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Open Positions</span>
                <span className="text-sm">{companyJobs.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Open Positions at {company.name}</h2>

      {companyJobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-lg font-medium">No open positions</p>
            <p className="text-gray-500 dark:text-gray-400">
              This company doesn't have any open positions at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companyJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {job.location}
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
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="mr-1 h-4 w-4" />
                  <span>{job.salary}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild size="sm" className="w-full">
                  <Link href={`/jobs/${job.id}`}>View Job</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

