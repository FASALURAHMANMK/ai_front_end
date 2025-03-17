"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Building, Search, MapPin, DollarSign } from "lucide-react"
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
  industry: string
  location: string
}

export default function JobsPage() {
  const [jobRoles, setJobRoles] = useState<JobRole[]>([])
  const [companies, setCompanies] = useState<Record<string, Company>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [salaryFilter, setSalaryFilter] = useState([0, 200000])
  const [companyFilter, setCompanyFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([])

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Get active jobs only
        const activeJobs = (jobRolesData as JobRole[]).filter((job) => job.active)
        setJobRoles(activeJobs)

        // Create a map of company IDs to company data
        const companyMap = (companiesData as Company[]).reduce(
          (acc, company) => {
            acc[company.id] = company
            return acc
          },
          {} as Record<string, Company>,
        )

        setCompanies(companyMap)

        // Extract unique locations for filtering
        const locations = Array.from(new Set(activeJobs.map((job) => job.location.split("(")[0].trim())))
        setUniqueLocations(locations)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Parse salary string to get min and max values
  const getSalaryRange = (salaryString: string): [number, number] => {
    const matches = salaryString.match(/\$(\d+),(\d+)\s*-\s*\$(\d+),(\d+)/)
    if (matches) {
      const min = Number.parseInt(matches[1] + matches[2])
      const max = Number.parseInt(matches[3] + matches[4])
      return [min, max]
    }
    return [0, 200000] // Default range
  }

  const filteredJobs = jobRoles.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (companies[job.companyId]?.name || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLevel = levelFilter === "all" || job.level === levelFilter
    const matchesCompany = companyFilter === "all" || job.companyId === companyFilter

    // Location filter - check if job location starts with the selected location
    const matchesLocation =
      locationFilter === "all" || job.location.toLowerCase().startsWith(locationFilter.toLowerCase())

    // Salary filter
    const [minSalary, maxSalary] = getSalaryRange(job.salary)
    const matchesSalary = minSalary <= salaryFilter[1] && maxSalary >= salaryFilter[0]

    return matchesSearch && matchesLevel && matchesCompany && matchesLocation && matchesSalary
  })

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Jobs</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Find and apply for jobs that match your skills</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="md:col-span-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search jobs, skills, or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Experience Level</Label>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Entry-Level">Entry-Level</SelectItem>
                <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Location</Label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Company</Label>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {Object.entries(companies).map(([id, company]) => (
                  <SelectItem key={id} value={id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="space-y-4">
            <Label className="text-sm font-medium">Salary Range</Label>
            <div className="px-2">
              <Slider value={salaryFilter} min={0} max={200000} step={10000} onValueChange={setSalaryFilter} />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>${(salaryFilter[0] / 1000).toFixed(0)}k</span>
                <span>${(salaryFilter[1] / 1000).toFixed(0)}k</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </CardContent>
              <CardFooter>
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Search className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium">No jobs found</p>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            const company = companies[job.companyId]
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
                      <MapPin className="mr-1 h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/jobs/${job.id}`}>View Job</Link>
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

import { Label } from "@/components/ui/label"

