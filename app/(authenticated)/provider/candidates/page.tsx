"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, FileDown, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import interviewsData from "@/data/interviews.json"
import jobRolesData from "@/data/job-roles.json"
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
}

interface JobRole {
  id: string
  title: string
}

interface Candidate {
  id: string
  name: string
  email: string
}

export default function ProviderCandidatesPage() {
  const { user } = useAuth()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [jobRoles, setJobRoles] = useState<Record<string, string>>({})
  const [candidates, setCandidates] = useState<Record<string, Candidate>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Filter interviews by the provider's company
        const companyInterviews = (interviewsData as Interview[]).filter(
          (interview) => interview.companyId === user?.companyId,
        )

        // Create a map of job role IDs to titles
        const roleMap = (jobRolesData as JobRole[]).reduce(
          (acc, role) => {
            acc[role.id] = role.title
            return acc
          },
          {} as Record<string, string>,
        )

        // Create a map of user IDs to candidate data
        const candidateMap = (usersData as Candidate[])
          .filter((u) => u.role === "candidate")
          .reduce(
            (acc, candidate) => {
              acc[candidate.id] = candidate
              return acc
            },
            {} as Record<string, Candidate>,
          )

        setInterviews(companyInterviews)
        setJobRoles(roleMap)
        setCandidates(candidateMap)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.companyId) {
      fetchData()
    }
  }, [user])

  const handleUpdateStatus = (interviewId: string, newStatus: string) => {
    // In a real app, this would be an API call
    setInterviews(
      interviews.map((interview) =>
        interview.id === interviewId ? { ...interview, applicationStatus: newStatus } : interview,
      ),
    )
  }

  const filteredInterviews = interviews.filter((interview) => {
    const candidate = candidates[interview.userId]
    if (!candidate) return false

    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (jobRoles[interview.jobRoleId] || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || interview.applicationStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Candidates</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review candidate interviews and make hiring decisions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild variant="outline">
            <Link href="#">
              <FileDown className="mr-2 h-4 w-4" />
              Export Results
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Candidate Applications</CardTitle>
          <CardDescription>{interviews.length} candidates have completed interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:max-w-md"
            />
            <select
              className="px-3 py-2 rounded-md border border-input bg-background"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="under_review">Under Review</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Date Applied</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No candidates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInterviews.map((interview) => {
                      const candidate = candidates[interview.userId]
                      return (
                        <TableRow key={interview.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>{candidate?.name.charAt(0) || "?"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{candidate?.name}</div>
                                <div className="text-sm text-muted-foreground">{candidate?.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{jobRoles[interview.jobRoleId] || "Unknown Position"}</TableCell>
                          <TableCell>{new Date(interview.startedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/provider/candidates/${interview.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(interview.id, "hired")}>
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Hire Candidate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(interview.id, "rejected")}>
                                  <XCircle className="mr-2 h-4 w-4 text-red-500" /> Reject Candidate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

