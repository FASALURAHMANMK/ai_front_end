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
import { Eye, MoreHorizontal, FileDown } from "lucide-react"
import interviewsData from "@/data/interviews.json"
import jobRolesData from "@/data/job-roles.json"

interface Interview {
  id: string
  userId: string
  jobRoleId: string
  status: string
  startedAt: string
  completedAt: string
  score: number
  feedback: string
  responses: any[]
}

interface JobRole {
  id: string
  title: string
}

interface Candidate {
  id: string
  name: string
  email: string
  interviews: Interview[]
  latestScore: number
  averageScore: number
}

// Mock candidate data
const candidatesData = [
  {
    id: "u2",
    name: "Jane Smith",
    email: "candidate@example.com",
  },
]

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [jobRoles, setJobRoles] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Create a map of job role IDs to titles
        const roleMap = (jobRolesData as JobRole[]).reduce(
          (acc, role) => {
            acc[role.id] = role.title
            return acc
          },
          {} as Record<string, string>,
        )

        setJobRoles(roleMap)

        // Process candidate data with their interviews
        const processedCandidates = candidatesData.map((candidate) => {
          const candidateInterviews = (interviewsData as Interview[]).filter(
            (interview) => interview.userId === candidate.id,
          )

          const latestScore =
            candidateInterviews.length > 0 ? candidateInterviews[candidateInterviews.length - 1].score : 0

          const averageScore =
            candidateInterviews.length > 0
              ? Math.round(
                  candidateInterviews.reduce((sum, interview) => sum + interview.score, 0) / candidateInterviews.length,
                )
              : 0

          return {
            ...candidate,
            interviews: candidateInterviews,
            latestScore,
            averageScore,
          }
        })

        setCandidates(processedCandidates as Candidate[])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Candidates</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage candidate interviews</p>
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
          <CardTitle>Candidates</CardTitle>
          <CardDescription>{candidates.length} registered candidates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
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
                    <TableHead>Interviews</TableHead>
                    <TableHead>Latest Score</TableHead>
                    <TableHead>Average Score</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No candidates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{candidate.name}</div>
                              <div className="text-sm text-muted-foreground">{candidate.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {candidate.interviews.length > 0 ? (
                            <div className="space-y-1">
                              {candidate.interviews.slice(0, 2).map((interview, index) => (
                                <div key={index} className="text-sm">
                                  {jobRoles[interview.jobRoleId] || "Unknown Role"}
                                </div>
                              ))}
                              {candidate.interviews.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                  +{candidate.interviews.length - 2} more
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">No interviews</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {candidate.latestScore > 0 ? (
                            <Badge
                              className={
                                candidate.latestScore >= 80
                                  ? "bg-green-500"
                                  : candidate.latestScore >= 70
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }
                            >
                              {candidate.latestScore}/100
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {candidate.averageScore > 0 ? (
                            <Badge
                              className={
                                candidate.averageScore >= 80
                                  ? "bg-green-500"
                                  : candidate.averageScore >= 70
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }
                            >
                              {candidate.averageScore}/100
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">N/A</span>
                          )}
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
                                <Link href={`/admin/candidates/${candidate.id}`}>
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
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

